"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Button, Card, Textarea } from "@/components/ui";
import { RunOutputPanel } from "@/components/features/agents";
import { useAgentRunStream } from "@/hooks/use-agent-run-stream";
import { apiGetAgentTeam } from "@/lib/api/agents";
import { apiCreateAgentRun, apiGetAgentRun } from "@/lib/api/agent-runs";
import type { AgentTeam } from "@/types/agent.types";
import type { AgentRun } from "@/types/agent-run.types";

export default function AgentRunPage() {
  const params = useParams();
  const teamId = params.id as string;

  const [team, setTeam] = useState<AgentTeam | null>(null);
  const [goal, setGoal] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [pastRuns, setPastRuns] = useState<AgentRun[]>([]);
  const [selectedPastRun, setSelectedPastRun] = useState<AgentRun | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  const stream = useAgentRunStream();

  useEffect(() => {
    apiGetAgentTeam(teamId)
      .then((t) => {
        setTeam(t);
        setGoal(t.goal);
      })
      .catch(() => {})
      .finally(() => setPageLoading(false));
  }, [teamId]);

  const handleStartRun = useCallback(async () => {
    if (!goal.trim()) return;
    setIsStarting(true);
    setStartError(null);
    setSelectedPastRun(null);

    try {
      const runId = await apiCreateAgentRun({ teamId, goal });
      stream.connect(runId);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to start run";
      setStartError(message);
    } finally {
      setIsStarting(false);
    }
  }, [goal, teamId, stream]);

  const handleViewPastRun = useCallback(async (runId: string) => {
    try {
      const run = await apiGetAgentRun(runId);
      setSelectedPastRun(run);
    } catch {
      /* ignore */
    }
  }, []);

  if (pageLoading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse px-4 py-8 sm:px-6">
        <div className="h-8 w-48 bg-surface-tertiary rounded-lg mb-4" />
        <div className="h-32 bg-surface-tertiary rounded-2xl mb-4" />
        <div className="h-48 bg-surface-tertiary rounded-2xl" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 text-center">
        <p className="text-ai-error">Team not found</p>
      </div>
    );
  }

  const isRunning = stream.isConnected;
  const hasOutput = stream.steps.length > 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-ai-ink dark:text-white mb-1">
        {team.name}
      </h1>
      <p className="text-sm text-ai-graphite dark:text-ai-slate mb-6">
        {team.agents.length} agents &middot; {team.model.split("/").pop()}
      </p>

      <Card variant="outlined" padding="md" className="mb-6">
        <label className="block text-sm font-medium text-ai-ink dark:text-white mb-2">
          Goal
        </label>
        <Textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          rows={3}
          maxLength={5000}
          disabled={isRunning}
          placeholder="Describe what you want the agents to accomplish..."
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-ai-slate">
            {goal.length}/5000
          </span>
          <div className="flex gap-2">
            {isRunning && (
              <Button
                variant="outline"
                size="md"
                onClick={stream.disconnect}
              >
                Stop Watching
              </Button>
            )}
            <Button
              variant="gradient"
              size="md"
              disabled={isRunning || !goal.trim()}
              isLoading={isStarting}
              onClick={handleStartRun}
            >
              Run Team
            </Button>
          </div>
        </div>
        {startError && (
          <p className="mt-2 text-sm text-ai-error">{startError}</p>
        )}
      </Card>

      {hasOutput && (
        <RunOutputPanel
          steps={stream.steps}
          isComplete={stream.isComplete}
          error={stream.error}
          totalTokens={stream.totalTokens}
          totalDurationMs={stream.totalDurationMs}
        />
      )}

      {selectedPastRun && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-ai-ink dark:text-white mb-4">
            Past Run — {new Date(selectedPastRun.createdAt).toLocaleDateString("en-IN")}
          </h2>
          <RunOutputPanel
            steps={selectedPastRun.steps.map((s) => ({
              id: s.id,
              role: s.role,
              agentId: "",
              output: s.output ?? "",
              tokenCount: s.tokenCount,
              durationMs: s.durationMs,
              status: s.status,
            }))}
            isComplete={true}
            error={selectedPastRun.errorMessage}
            totalTokens={selectedPastRun.totalTokensUsed}
            totalDurationMs={0}
          />
        </div>
      )}
    </div>
  );
}
