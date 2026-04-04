"use client";

import React from "react";
import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import type { AgentTeamListItem } from "@/types/agent.types";

const ROLE_COLOR: Record<string, string> = {
  RESEARCHER: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  WRITER: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
  REVIEWER: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  CODER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  CRITIC: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  CUSTOM: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
};

interface TeamCardProps {
  team: AgentTeamListItem;
  onDelete: (id: string) => void;
  deleteLoading: string | null;
}

export function TeamCard({ team, onDelete, deleteLoading }: TeamCardProps) {
  const lastRun = team.lastRunAt
    ? new Date(team.lastRunAt).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })
    : "Never";

  return (
    <Card variant="outlined" padding="md" hoverable className="flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-ai-ink dark:text-white truncate">
            {team.name}
          </h3>
          {team.description && (
            <p className="mt-1 text-sm text-ai-graphite dark:text-ai-slate line-clamp-2">
              {team.description}
            </p>
          )}
        </div>
        <Badge variant="default" size="sm" className="ml-2 shrink-0">
          {team.agentCount} agents
        </Badge>
      </div>

      <p className="text-xs text-ai-slate mb-3 line-clamp-1">
        Model: {team.model.split("/").pop()}
      </p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
        <span className="text-xs text-ai-slate">Last run: {lastRun}</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(team.id)}
            isLoading={deleteLoading === team.id}
          >
            Delete
          </Button>
          <Link href={`/agents/${team.id}/run`}>
            <Button variant="primary" size="sm">Run</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
