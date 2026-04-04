"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardTitle, Badge, Button } from "@/components/ui";
import { apiGetAdminStats, apiGetAdminRuns, apiGetAdminCredits, type AdminStats, type AdminRun, type ApiCredits } from "@/lib/api/admin";

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <Card variant="outlined" padding="md">
      <p className="text-xs font-medium text-ai-graphite dark:text-ai-slate uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-bold text-ai-ink dark:text-white mt-1 tabular-nums">{value}</p>
      {sub && <p className="text-xs text-ai-slate mt-0.5">{sub}</p>}
    </Card>
  );
}

const STATUS_COLOR: Record<string, "success" | "warning" | "error" | "default"> = {
  COMPLETED: "success",
  RUNNING: "warning",
  QUEUED: "default",
  FAILED: "error",
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [runs, setRuns] = useState<AdminRun[]>([]);
  const [credits, setCredits] = useState<ApiCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([apiGetAdminStats(), apiGetAdminRuns(10), apiGetAdminCredits()])
      .then(([s, r, c]) => { setStats(s); setRuns(r); setCredits(c); })
      .catch(() => setError("Access denied or failed to load admin data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 sm:px-6">
        <div className="h-8 w-48 bg-surface-tertiary rounded-lg mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-surface-tertiary rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="text-center py-16">
          <p className="text-lg font-semibold text-ai-error">{error}</p>
          <p className="text-sm text-ai-slate mt-2">You must be logged in with an admin email to access this page.</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ai-ink dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-ai-graphite dark:text-ai-slate mt-1">Platform overview and management</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/agents"><Button variant="outline" size="sm">Manage Agents</Button></Link>
          <Link href="/admin/users"><Button variant="outline" size="sm">Manage Users</Button></Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users" value={stats.users.total} sub={`${stats.users.active} active`} />
        <StatCard label="Runs This Month" value={stats.runs.thisMonth} sub={`${stats.runs.total} total`} />
        <StatCard label="Tokens This Month" value={stats.tokens.thisMonth.toLocaleString()} sub={`${stats.tokens.total.toLocaleString()} total`} />
        <StatCard label="Agent Teams" value={stats.teams} sub={`${stats.library.templates} templates`} />
      </div>

      {/* Plan distribution */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card variant="outlined" padding="md">
          <CardTitle className="text-base mb-3">Users by Plan</CardTitle>
          <div className="space-y-2">
            {Object.entries(stats.users.byPlan).map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between">
                <Badge variant={plan === "PRO" ? "primary" : plan === "BYOK" ? "success" : "default"} size="sm">{plan}</Badge>
                <span className="text-sm font-semibold text-ai-ink dark:text-white tabular-nums">{count}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card variant="outlined" padding="md">
          <CardTitle className="text-base mb-3">Platform Library</CardTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ai-graphite dark:text-ai-slate">Platform Agents</span>
              <span className="text-sm font-semibold text-ai-ink dark:text-white">{stats.library.platformAgents}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ai-graphite dark:text-ai-slate">Templates</span>
              <span className="text-sm font-semibold text-ai-ink dark:text-white">{stats.library.templates}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* API Credits */}
      {credits && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card variant="outlined" padding="md" className={credits.openRouter && credits.openRouter.remaining !== null && credits.openRouter.remaining < 1 ? "border-red-300 dark:border-red-500/50" : ""}>
            <CardTitle className="text-base mb-3">OpenRouter Credits</CardTitle>
            {credits.openRouter ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-ai-graphite dark:text-ai-slate">Usage</span>
                  <span className="text-sm font-semibold text-ai-ink dark:text-white">${credits.openRouter.usage.toFixed(4)}</span>
                </div>
                {credits.openRouter.limit !== null && (
                  <div className="flex justify-between">
                    <span className="text-sm text-ai-graphite dark:text-ai-slate">Limit</span>
                    <span className="text-sm font-semibold text-ai-ink dark:text-white">${credits.openRouter.limit.toFixed(2)}</span>
                  </div>
                )}
                {credits.openRouter.remaining !== null && (
                  <div className="flex justify-between">
                    <span className="text-sm text-ai-graphite dark:text-ai-slate">Remaining</span>
                    <span className={`text-sm font-bold ${credits.openRouter.remaining < 1 ? "text-red-500" : "text-emerald-600 dark:text-emerald-400"}`}>
                      ${credits.openRouter.remaining.toFixed(2)}
                    </span>
                  </div>
                )}
                {credits.openRouter.limit === null && (
                  <p className="text-xs text-ai-slate">No spending limit set (pay-as-you-go)</p>
                )}
                {credits.openRouter.expiresAt && (
                  <p className="text-xs text-ai-slate">
                    Key expires: {new Date(credits.openRouter.expiresAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-ai-slate">OpenRouter key not configured</p>
            )}
          </Card>
          <Card variant="outlined" padding="md">
            <CardTitle className="text-base mb-3">OpenAI Credits</CardTitle>
            {credits.openAi ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-ai-graphite dark:text-ai-slate">Status</span>
                  <Badge variant={credits.openAi.status === "active" ? "success" : "error"} size="sm">
                    {credits.openAi.status}
                  </Badge>
                </div>
                <p className="text-xs text-ai-slate">{credits.openAi.note}</p>
              </div>
            ) : (
              <p className="text-sm text-ai-slate">OpenAI key not configured</p>
            )}
          </Card>
        </div>
      )}

      {/* Recent runs */}
      <Card variant="outlined" padding="md">
        <CardTitle className="text-base mb-4">Recent Runs (All Users)</CardTitle>
        {runs.length === 0 ? (
          <p className="text-sm text-ai-slate text-center py-4">No runs yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ai-slate border-b border-border">
                  <th className="pb-2 pr-4">User</th>
                  <th className="pb-2 pr-4">Team</th>
                  <th className="pb-2 pr-4">Goal</th>
                  <th className="pb-2 pr-4">Model</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4 text-right">Tokens</th>
                  <th className="pb-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {runs.map(run => (
                  <tr key={run.id} className="hover:bg-surface-secondary/50">
                    <td className="py-2 pr-4">
                      <div className="text-ai-ink dark:text-white font-medium truncate max-w-[120px]">{run.user.name}</div>
                      <div className="text-xs text-ai-slate">{run.user.plan}</div>
                    </td>
                    <td className="py-2 pr-4 text-ai-charcoal dark:text-ai-cloud truncate max-w-[100px]">{run.team.name}</td>
                    <td className="py-2 pr-4 text-ai-charcoal dark:text-ai-cloud truncate max-w-[200px]">{run.goal}</td>
                    <td className="py-2 pr-4 text-xs text-ai-slate">{run.model.split('/').pop()}</td>
                    <td className="py-2 pr-4">
                      <Badge variant={STATUS_COLOR[run.status] ?? "default"} size="sm">{run.status}</Badge>
                    </td>
                    <td className="py-2 pr-4 text-right tabular-nums text-ai-ink dark:text-white">{run.totalTokensUsed.toLocaleString()}</td>
                    <td className="py-2 text-right text-xs text-ai-slate">
                      {new Date(run.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
