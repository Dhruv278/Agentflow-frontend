"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button, ConfirmDialog } from "@/components/ui";
import { TeamCard } from "@/components/features/agents";
import { apiGetAgentTeams, apiDeleteAgentTeam } from "@/lib/api/agents";
import type { AgentTeamListItem } from "@/types/agent.types";

export default function AgentsPage() {
  const [teams, setTeams] = useState<AgentTeamListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const loadTeams = useCallback(() => {
    setIsLoading(true);
    setError(null);
    apiGetAgentTeams()
      .then((res) => setTeams(res.items))
      .catch(() => setError("Failed to load agent teams"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const handleDeleteRequest = useCallback((id: string) => {
    setPendingDeleteId(id);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!pendingDeleteId) return;
    setDeleteLoading(pendingDeleteId);
    try {
      await apiDeleteAgentTeam(pendingDeleteId);
      setTeams((prev) => prev.filter((t) => t.id !== pendingDeleteId));
      setPendingDeleteId(null);
    } catch {
      setError("Failed to delete team");
    } finally {
      setDeleteLoading(null);
    }
  }, [pendingDeleteId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse px-4 py-8 sm:px-6">
        <div className="h-8 w-32 bg-surface-tertiary rounded-lg mb-2" />
        <div className="h-4 w-64 bg-surface-tertiary rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-44 bg-surface-tertiary rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ai-ink dark:text-white">Agent Teams</h1>
          <p className="mt-1 text-sm text-ai-graphite dark:text-ai-slate">
            Create and manage your AI agent teams
          </p>
        </div>
        <Link href="/agents/new">
          <Button variant="primary" size="md">New Team</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-500/10">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={loadTeams}>
            Retry
          </Button>
        </div>
      )}

      {teams.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface py-16">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-ai-primary-soft text-ai-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-ai-ink dark:text-white">No agent teams yet</p>
          <p className="mt-1 text-xs text-ai-graphite dark:text-ai-slate mb-4">
            Create your first team to get started
          </p>
          <Link href="/agents/new">
            <Button variant="gradient" size="md">Create First Team</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onDelete={handleDeleteRequest}
              deleteLoading={deleteLoading}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete Agent Team"
        description="Are you sure you want to delete this team? All agents and run history associated with it will be permanently removed. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        isLoading={deleteLoading !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}
