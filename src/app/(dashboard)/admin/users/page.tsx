"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardTitle, Badge, Button } from "@/components/ui";
import { apiGetAdminUsers, type AdminUser } from "@/lib/api/admin";

const PLAN_BADGE: Record<string, "default" | "primary" | "success"> = {
  FREE: "default",
  PRO: "primary",
  BYOK: "success",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback((p: number) => {
    setLoading(true);
    apiGetAdminUsers(p)
      .then(res => {
        setUsers(res.items);
        setPage(res.page);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch(() => setError("Failed to load users"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(1); }, [load]);

  if (loading && users.length === 0) {
    return (
      <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 sm:px-6">
        <div className="h-8 w-32 bg-surface-tertiary rounded-lg mb-8" />
        <div className="h-64 bg-surface-tertiary rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 text-center py-16">
        <p className="text-ai-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-ai-ink dark:text-white mb-1">All Users</h1>
      <p className="text-sm text-ai-graphite dark:text-ai-slate mb-6">{total} total users</p>

      <Card variant="outlined" padding="md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-ai-slate border-b border-border">
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Email</th>
                <th className="pb-2 pr-4">Plan</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2 pr-4 text-right">Teams</th>
                <th className="pb-2 pr-4 text-right">Runs</th>
                <th className="pb-2 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-surface-secondary/50">
                  <td className="py-2.5 pr-4 font-medium text-ai-ink dark:text-white">{user.name}</td>
                  <td className="py-2.5 pr-4 text-ai-charcoal dark:text-ai-cloud">{user.email}</td>
                  <td className="py-2.5 pr-4">
                    <Badge variant={PLAN_BADGE[user.plan] ?? "default"} size="sm">{user.plan}</Badge>
                  </td>
                  <td className="py-2.5 pr-4">
                    <Badge variant={user.status === "ACTIVE" ? "success" : "error"} size="sm">{user.status}</Badge>
                  </td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{user.teamCount}</td>
                  <td className="py-2.5 pr-4 text-right tabular-nums">{user.runCount}</td>
                  <td className="py-2.5 text-right text-xs text-ai-slate">
                    {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className="text-xs text-ai-slate">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => load(page - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => load(page + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
