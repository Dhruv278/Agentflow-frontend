"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/ui";
import { TemplateCard } from "@/components/features/agents/template-card";
import { apiGetTemplates } from "@/lib/api/templates";
import { apiUseTemplate } from "@/lib/api/templates";
import { apiCreateAgentTeam } from "@/lib/api/agents";
import type { TemplateTeam } from "@/types/agent.types";

export default function NewAgentTeamPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Record<string, TemplateTeam[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [usingTemplate, setUsingTemplate] = useState<string | null>(null);
  const [creatingBlank, setCreatingBlank] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGetTemplates()
      .then(setTemplates)
      .catch(() => setError("Failed to load templates"))
      .finally(() => setIsLoading(false));
  }, []);

  const handleUseTemplate = useCallback(
    async (templateId: string) => {
      setUsingTemplate(templateId);
      setError(null);
      try {
        const team = await apiUseTemplate(templateId);
        router.push(`/agents/${team.id}/canvas`);
      } catch {
        setError("Failed to create team from template");
        setUsingTemplate(null);
      }
    },
    [router],
  );

  const handleStartFromScratch = useCallback(async () => {
    setCreatingBlank(true);
    setError(null);
    try {
      const team = await apiCreateAgentTeam({
        name: "New Team",
        goal: "Describe your goal here...",
        agents: [
          { role: "RESEARCHER", systemPrompt: "You are a researcher.", order: 1 },
        ],
      });
      router.push(`/agents/${team.id}/canvas`);
    } catch {
      setError("Failed to create team");
      setCreatingBlank(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse px-4 py-8 sm:px-6">
        <div className="h-8 w-48 bg-surface-tertiary rounded-lg mb-2" />
        <div className="h-4 w-80 bg-surface-tertiary rounded mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-36 bg-surface-tertiary rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const categories = Object.keys(templates);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ai-ink dark:text-white">
            Create Agent Team
          </h1>
          <p className="mt-1 text-sm text-ai-graphite dark:text-ai-slate">
            Pick a template to get started instantly, or build from scratch.
          </p>
        </div>
        <Button
          variant="outline"
          size="md"
          isLoading={creatingBlank}
          onClick={handleStartFromScratch}
        >
          Start from Scratch
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-500/10">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {categories.length === 0 ? (
        <Card variant="outlined" padding="lg" className="text-center">
          <p className="text-sm text-ai-graphite dark:text-ai-slate">
            No templates available yet. Start from scratch to build your first team.
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="text-lg font-semibold text-ai-ink dark:text-white mb-3">
                {category}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates[category].map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    onClick={() => handleUseTemplate(tpl.id)}
                    isLoading={usingTemplate === tpl.id}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
