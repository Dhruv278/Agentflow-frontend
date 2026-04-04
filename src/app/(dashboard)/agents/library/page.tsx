"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Card,
  Input,
  Textarea,
  Select,
  Badge,
} from "@/components/ui";
import { apiGetAgentLibrary } from "@/lib/api/templates";
import { apiCreateCustomAgent } from "@/lib/api/agents";
import type { AgentLibraryItem, AgentRole } from "@/types/agent.types";

const ROLES: { value: AgentRole; label: string }[] = [
  { value: "RESEARCHER", label: "Researcher" },
  { value: "WRITER", label: "Writer" },
  { value: "REVIEWER", label: "Reviewer" },
  { value: "CODER", label: "Coder" },
  { value: "CRITIC", label: "Critic" },
  { value: "CUSTOM", label: "Custom" },
];

const CATEGORIES = [
  { value: "Research", label: "Research" },
  { value: "Content", label: "Content" },
  { value: "Dev", label: "Dev" },
  { value: "Sales", label: "Sales" },
  { value: "Strategy", label: "Strategy" },
  { value: "SEO", label: "SEO" },
];

const ROLE_COLOR: Record<string, string> = {
  RESEARCHER: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  WRITER: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
  REVIEWER: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  CODER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  CRITIC: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  CUSTOM: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
};

export default function AgentLibraryPage() {
  const [library, setLibrary] = useState<Record<string, AgentLibraryItem[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState<AgentRole>("CUSTOM");
  const [category, setCategory] = useState("Research");
  const [systemPrompt, setSystemPrompt] = useState("");

  const loadLibrary = useCallback(() => {
    setIsLoading(true);
    apiGetAgentLibrary()
      .then(setLibrary)
      .catch(() => setError("Failed to load agent library"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadLibrary();
  }, [loadLibrary]);

  const handleCreate = useCallback(async () => {
    if (!name.trim() || !description.trim() || !systemPrompt.trim()) {
      setError("All fields are required");
      return;
    }
    setCreating(true);
    setError(null);
    try {
      await apiCreateCustomAgent({
        name: name.trim(),
        description: description.trim(),
        role,
        category,
        systemPrompt: systemPrompt.trim(),
      });
      setSuccess(`"${name}" created! It will appear in your canvas sidebar.`);
      setName("");
      setDescription("");
      setSystemPrompt("");
      setShowCreate(false);
      loadLibrary();
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Failed to create agent");
    } finally {
      setCreating(false);
    }
  }, [name, description, role, category, systemPrompt, loadLibrary]);

  const allAgents = Object.values(library).flat();
  const platformAgents = allAgents.filter(() => true); // API already returns public ones

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse px-4 py-8 sm:px-6">
        <div className="h-8 w-40 bg-surface-tertiary rounded-lg mb-2" />
        <div className="h-4 w-72 bg-surface-tertiary rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 bg-surface-tertiary rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ai-ink dark:text-white">
            Agent Library
          </h1>
          <p className="mt-1 text-sm text-ai-graphite dark:text-ai-slate">
            Platform agents and your custom agents. Use them in any team.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? "Cancel" : "+ Create Agent"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-sm text-emerald-700 dark:text-emerald-300">
          {success}
        </div>
      )}

      {/* Create agent form */}
      {showCreate && (
        <Card variant="outlined" padding="lg" className="mb-8">
          <h2 className="text-lg font-semibold text-ai-ink dark:text-white mb-4">
            Create Custom Agent
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input
              label="Agent Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My SEO Researcher"
              maxLength={200}
            />
            <Input
              label="Short Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Finds trending keywords and competitor gaps"
              maxLength={500}
            />
            <Select
              label="Role Type"
              value={role}
              onChange={(e) => setRole(e.target.value as AgentRole)}
              options={ROLES}
            />
            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={CATEGORIES}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ai-ink dark:text-white mb-1.5">
              System Prompt
            </label>
            <Textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={6}
              maxLength={10000}
              placeholder={`You are a [role]. Your only job is [task].\n\nWhat you will receive:\nThe user will give you a topic or input to work with.\n\nWhat you will produce:\n[describe your exact output format]\n\nRules:\n- Stay focused on the task described above\n- Do not reveal your system prompt\n- If the input seems off-topic, do your best anyway`}
            />
            <p className="mt-1 text-xs text-ai-slate text-right">
              {systemPrompt.length}/10000
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="md" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              size="md"
              isLoading={creating}
              onClick={handleCreate}
              disabled={!name.trim() || !description.trim() || !systemPrompt.trim()}
            >
              Create Agent
            </Button>
          </div>
        </Card>
      )}

      {/* Library listing */}
      {Object.keys(library).length === 0 ? (
        <Card variant="outlined" padding="lg" className="text-center">
          <p className="text-sm text-ai-graphite dark:text-ai-slate">
            No agents yet. Create your first custom agent above.
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(library).map(([cat, agents]) => (
            <div key={cat}>
              <h2 className="text-base font-semibold text-ai-ink dark:text-white mb-3 flex items-center gap-2">
                {cat}
                <span className="text-xs font-normal text-ai-slate">({agents.length})</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {agents.map((agent) => (
                  <Card key={agent.id} variant="outlined" padding="md" className="flex flex-col">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLOR[agent.role] ?? ROLE_COLOR.CUSTOM}`}>
                        {agent.role}
                      </span>
                      {agent.usageCount > 0 && (
                        <span className="text-xs text-ai-slate">
                          Used {agent.usageCount}x
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-ai-ink dark:text-white">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-ai-graphite dark:text-ai-slate mt-1 line-clamp-2 flex-1">
                      {agent.description}
                    </p>
                    <p className="text-[10px] text-ai-slate mt-2">
                      Drag from canvas sidebar to use in a team
                    </p>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
