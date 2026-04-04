"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Input, Textarea, Badge, Select } from "@/components/ui";
import { apiGetAdminAgents, apiUpdateAdminAgent, type AdminAgent } from "@/lib/api/admin";

const ROLE_COLOR: Record<string, string> = {
  RESEARCHER: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  WRITER: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
  REVIEWER: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  CODER: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  CRITIC: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
  CUSTOM: "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300",
};

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<AdminAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<AdminAgent>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    apiGetAdminAgents()
      .then(setAgents)
      .catch(() => setError("Failed to load agents"))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = useCallback((agent: AdminAgent) => {
    setEditingId(agent.id);
    setEditData({ name: agent.name, description: agent.description, systemPrompt: agent.systemPrompt, category: agent.category });
    setError(null);
    setSuccess(null);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditData({});
  }, []);

  const saveEdit = useCallback(async () => {
    if (!editingId) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await apiUpdateAdminAgent(editingId, editData);
      setAgents(prev => prev.map(a => a.id === editingId ? { ...a, ...updated } : a));
      setEditingId(null);
      setEditData({});
      setSuccess("Agent updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }, [editingId, editData]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl animate-pulse px-4 py-8 sm:px-6">
        <div className="h-8 w-48 bg-surface-tertiary rounded-lg mb-8" />
        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-surface-tertiary rounded-xl mb-4" />)}
      </div>
    );
  }

  const grouped: Record<string, AdminAgent[]> = {};
  for (const agent of agents) {
    if (!grouped[agent.category]) grouped[agent.category] = [];
    grouped[agent.category].push(agent);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-ai-ink dark:text-white mb-1">Manage Platform Agents</h1>
      <p className="text-sm text-ai-graphite dark:text-ai-slate mb-6">Edit system prompts, names, and categories for all platform agents.</p>

      {error && <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-sm text-red-700 dark:text-red-300">{error}</div>}
      {success && <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-sm text-emerald-700 dark:text-emerald-300">{success}</div>}

      {Object.entries(grouped).map(([category, categoryAgents]) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-semibold text-ai-ink dark:text-white mb-3">{category} ({categoryAgents.length})</h2>
          <div className="space-y-3">
            {categoryAgents.map(agent => (
              <Card key={agent.id} variant="outlined" padding="md">
                {editingId === agent.id ? (
                  /* Edit mode */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input label="Name" value={editData.name ?? ""} onChange={e => setEditData(d => ({ ...d, name: e.target.value }))} />
                      <Input label="Description" value={editData.description ?? ""} onChange={e => setEditData(d => ({ ...d, description: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-ai-ink dark:text-white mb-1">System Prompt</label>
                      <Textarea
                        value={editData.systemPrompt ?? ""}
                        onChange={e => setEditData(d => ({ ...d, systemPrompt: e.target.value }))}
                        rows={8}
                        maxLength={10000}
                      />
                      <p className="mt-1 text-xs text-ai-slate text-right">{(editData.systemPrompt ?? "").length}/10000</p>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={cancelEdit}>Cancel</Button>
                      <Button variant="primary" size="sm" isLoading={saving} onClick={saveEdit}>Save Changes</Button>
                    </div>
                  </div>
                ) : (
                  /* View mode */
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROLE_COLOR[agent.role] ?? ROLE_COLOR.CUSTOM}`}>{agent.role}</span>
                        <h3 className="text-sm font-semibold text-ai-ink dark:text-white">{agent.name}</h3>
                        {agent.usageCount > 0 && <span className="text-xs text-ai-slate">Used {agent.usageCount}x</span>}
                      </div>
                      <Button variant="outline" size="sm" onClick={() => startEdit(agent)}>Edit</Button>
                    </div>
                    <p className="text-xs text-ai-graphite dark:text-ai-slate mb-2">{agent.description}</p>
                    <details className="group">
                      <summary className="text-xs text-ai-primary cursor-pointer hover:underline">View system prompt</summary>
                      <pre className="mt-2 p-3 rounded-lg bg-surface-secondary text-xs text-ai-charcoal dark:text-ai-cloud whitespace-pre-wrap font-mono max-h-60 overflow-y-auto">
                        {agent.systemPrompt}
                      </pre>
                    </details>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
