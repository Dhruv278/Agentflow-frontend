"use client";

import React from "react";
import { Card, Badge } from "@/components/ui";
import type { TemplateTeam } from "@/types/agent.types";

const CATEGORY_COLOR: Record<string, string> = {
  Research: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  Content: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
  Dev: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  Sales: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  Strategy: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  SEO: "bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300",
};

interface TemplateCardProps {
  template: TemplateTeam;
  onClick: () => void;
  isLoading: boolean;
}

export function TemplateCard({ template, onClick, isLoading }: TemplateCardProps) {
  return (
    <Card
      variant="outlined"
      padding="md"
      hoverable
      className="cursor-pointer transition-all hover:ring-2 hover:ring-ai-primary/40"
      onClick={isLoading ? undefined : onClick}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-ai-ink dark:text-white">
          {template.name}
        </h3>
        {template.category && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLOR[template.category] ?? "bg-gray-100 text-gray-700"}`}>
            {template.category}
          </span>
        )}
      </div>

      {template.description && (
        <p className="text-sm text-ai-graphite dark:text-ai-slate mb-3 line-clamp-2">
          {template.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1.5">
        {template.agents.map((agent, i) => (
          <React.Fragment key={agent.id}>
            <Badge variant="default" size="sm">{agent.role}</Badge>
            {i < template.agents.length - 1 && (
              <span className="text-xs text-ai-slate self-center">→</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {isLoading && (
        <div className="mt-3 text-xs text-ai-primary font-medium">
          Creating your copy...
        </div>
      )}
    </Card>
  );
}
