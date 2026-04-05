"use client";

import React from "react";
import { Badge, Spinner } from "@/components/ui";
import type { StreamStep } from "@/hooks/use-agent-run-stream";

const STATUS_ICON: Record<string, React.ReactNode> = {
  PENDING: <span className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700" />,
  RUNNING: <Spinner size="sm" />,
  COMPLETED: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
  ),
  FAILED: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-500">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" />
    </svg>
  ),
};

const ROLE_BADGE: Record<string, "default" | "primary" | "success"> = {
  RESEARCHER: "primary",
  WRITER: "success",
  REVIEWER: "default",
  CODER: "primary",
  CRITIC: "default",
  CUSTOM: "default",
};

interface RunOutputPanelProps {
  steps: StreamStep[];
  isComplete: boolean;
  error: string | null;
  totalTokens: number;
  totalDurationMs: number;
  isStale?: boolean;
}

export function RunOutputPanel({
  steps,
  isComplete,
  error,
  totalTokens,
  totalDurationMs,
  isStale,
}: RunOutputPanelProps) {
  function handleDownload() {
    const text = steps
      .map((s) => `=== ${s.role} ===\n${s.output}\n`)
      .join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agent-run-output.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div
          key={step.id}
          className="rounded-xl border border-border bg-surface p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            {STATUS_ICON[step.status]}
            <Badge variant={ROLE_BADGE[step.role] ?? "default"} size="sm">
              {step.role}
            </Badge>
            {step.status === "COMPLETED" && (
              <span className="ml-auto text-xs text-ai-slate tabular-nums">
                {step.tokenCount} tokens &middot; {(step.durationMs / 1000).toFixed(1)}s
              </span>
            )}
          </div>
          <div className="text-sm text-ai-charcoal dark:text-ai-cloud whitespace-pre-wrap font-mono leading-relaxed max-h-80 overflow-y-auto">
            {step.output || (step.status === "RUNNING" ? "Generating..." : "")}
          </div>
        </div>
      ))}

      {isStale && !isComplete && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-4">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            No activity for a while. The model may be processing a large response. Please wait...
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-4">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {isComplete && !error && steps.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 p-4">
          <div>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              Run complete
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
              {totalTokens} total tokens &middot;{" "}
              {(totalDurationMs / 1000).toFixed(1)}s total
            </p>
          </div>
          <button
            onClick={handleDownload}
            className="text-sm font-medium text-emerald-700 dark:text-emerald-300 underline hover:no-underline"
          >
            Download Output
          </button>
        </div>
      )}
    </div>
  );
}
