"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardTitle, Badge, Button } from "@/components/ui";
import api from "@/lib/api/axios";

interface UsageStats {
  plan: string;
  usage: {
    runsThisMonth: number;
    runsLimit: number | null;
    runsRemaining: number | null;
    activeRuns: number;
    activeRunsLimit: number | null;
    teams: number;
    teamsLimit: number | null;
    tokensThisMonth: number;
    tokenBudgetPerRun: number;
    totalRunsAllTime: number;
  };
  recentRuns: {
    id: string;
    goal: string;
    model: string;
    status: string;
    totalTokensUsed: number;
    teamName: string;
    createdAt: string;
  }[];
}

const STATUS_COLOR: Record<string, "success" | "warning" | "error" | "default"> = {
  COMPLETED: "success",
  RUNNING: "warning",
  QUEUED: "default",
  FAILED: "error",
};

const PLAN_BADGE: Record<string, "default" | "primary" | "success"> = {
  FREE: "default",
  PRO: "primary",
  BYOK: "success",
};

function ProgressBar({ used, total, color = "bg-ai-primary" }: { used: number; total: number | null; color?: string }) {
  if (total === null) return <span className="text-xs text-ai-slate">Unlimited</span>;
  const pct = Math.min(100, (used / total) * 100);
  const isHigh = pct >= 80;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-ai-graphite dark:text-ai-slate">{used} / {total}</span>
        <span className={isHigh ? "text-red-500 font-medium" : "text-ai-slate"}>{Math.round(pct)}%</span>
      </div>
      <div className="h-2 rounded-full bg-surface-tertiary overflow-hidden">
        <div className={`h-full rounded-full transition-all ${isHigh ? "bg-red-500" : color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SuccessBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium">Your plan has been upgraded successfully!</span>
      </div>
      <button onClick={onDismiss} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
        </svg>
      </button>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showUpgraded, setShowUpgraded] = useState(false);
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      setShowUpgraded(true);
      router.replace("/dashboard");
    }
  }, [searchParams, router]);

  useEffect(() => {
    api.get<{ data: UsageStats }>("/agent-runs/usage")
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse px-4 py-8 sm:px-6">
        <div className="h-8 w-40 bg-surface-tertiary rounded-lg mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 bg-surface-tertiary rounded-xl" />)}
        </div>
      </div>
    );
  }

  const u = stats?.usage;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {showUpgraded && <SuccessBanner onDismiss={() => setShowUpgraded(false)} />}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ai-ink dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-ai-graphite dark:text-ai-slate">Your usage and activity overview</p>
        </div>
        {stats && (
          <Badge variant={PLAN_BADGE[stats.plan] ?? "default"} size="md" dot>
            {stats.plan} Plan
          </Badge>
        )}
      </div>

      {u && (
        <>
          {/* Usage cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card variant="outlined" padding="md">
              <p className="text-xs font-medium text-ai-graphite dark:text-ai-slate uppercase tracking-wider mb-3">Runs This Month</p>
              <ProgressBar used={u.runsThisMonth} total={u.runsLimit} />
              {u.runsRemaining !== null && u.runsRemaining <= 3 && u.runsRemaining > 0 && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  Only {u.runsRemaining} runs remaining
                </p>
              )}
              {u.runsRemaining === 0 && (
                <Link href="/billing" className="mt-2 text-xs text-red-500 font-medium underline">
                  Upgrade to get more runs
                </Link>
              )}
            </Card>

            <Card variant="outlined" padding="md">
              <p className="text-xs font-medium text-ai-graphite dark:text-ai-slate uppercase tracking-wider mb-3">Agent Teams</p>
              <ProgressBar used={u.teams} total={u.teamsLimit} color="bg-purple-500" />
            </Card>

            <Card variant="outlined" padding="md">
              <p className="text-xs font-medium text-ai-graphite dark:text-ai-slate uppercase tracking-wider mb-1">Tokens This Month</p>
              <p className="text-2xl font-bold text-ai-ink dark:text-white tabular-nums">{u.tokensThisMonth.toLocaleString()}</p>
              <p className="text-xs text-ai-slate mt-1">{u.tokenBudgetPerRun.toLocaleString()} per run budget</p>
            </Card>

            <Card variant="outlined" padding="md">
              <p className="text-xs font-medium text-ai-graphite dark:text-ai-slate uppercase tracking-wider mb-1">Active Runs</p>
              <p className="text-2xl font-bold text-ai-ink dark:text-white tabular-nums">
                {u.activeRuns}{u.activeRunsLimit !== null ? ` / ${u.activeRunsLimit}` : ""}
              </p>
              <p className="text-xs text-ai-slate mt-1">{u.totalRunsAllTime} total all time</p>
            </Card>
          </div>

          {/* Recent runs */}
          <Card variant="outlined" padding="md">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-base">Recent Runs</CardTitle>
              <Link href="/agents">
                <Button variant="outline" size="sm">View All Teams</Button>
              </Link>
            </div>
            {stats.recentRuns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-ai-graphite dark:text-ai-slate mb-3">No runs yet</p>
                <Link href="/agents/new">
                  <Button variant="gradient" size="md">Pick a Template & Run</Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-ai-slate border-b border-border">
                      <th className="pb-2 pr-4">Team</th>
                      <th className="pb-2 pr-4">Goal</th>
                      <th className="pb-2 pr-4">Status</th>
                      <th className="pb-2 pr-4 text-right">Tokens</th>
                      <th className="pb-2 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {stats.recentRuns.map((run) => (
                      <tr key={run.id} className="hover:bg-surface-secondary/50">
                        <td className="py-2.5 pr-4 font-medium text-ai-ink dark:text-white truncate max-w-[120px]">{run.teamName}</td>
                        <td className="py-2.5 pr-4 text-ai-charcoal dark:text-ai-cloud truncate max-w-[200px]">{run.goal}</td>
                        <td className="py-2.5 pr-4">
                          <Badge variant={STATUS_COLOR[run.status] ?? "default"} size="sm">{run.status}</Badge>
                        </td>
                        <td className="py-2.5 pr-4 text-right tabular-nums">{run.totalTokensUsed.toLocaleString()}</td>
                        <td className="py-2.5 text-right text-xs text-ai-slate">
                          {new Date(run.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
