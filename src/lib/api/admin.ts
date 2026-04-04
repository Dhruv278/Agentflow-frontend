import api from './axios';

export interface AdminStats {
  users: { total: number; active: number; byPlan: Record<string, number> };
  teams: number;
  runs: { total: number; thisMonth: number };
  tokens: { total: number; thisMonth: number };
  library: { platformAgents: number; templates: number };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  plan: string;
  status: string;
  teamCount: number;
  runCount: number;
  createdAt: string;
}

export interface AdminAgent {
  id: string;
  name: string;
  description: string;
  role: string;
  systemPrompt: string;
  category: string;
  isPublic: boolean;
  usageCount: number;
  updatedAt: string;
}

export interface AdminRun {
  id: string;
  goal: string;
  model: string;
  status: string;
  totalTokensUsed: number;
  createdAt: string;
  completedAt: string | null;
  user: { email: string; name: string; plan: string };
  team: { name: string };
}

export async function apiCheckAdmin(): Promise<boolean> {
  try {
    const res = await api.get<{ data: { isAdmin: boolean } }>('/admin/check');
    return res.data.data.isAdmin;
  } catch {
    return false;
  }
}

export async function apiGetAdminStats(): Promise<AdminStats> {
  const res = await api.get<{ data: AdminStats }>('/admin/stats');
  return res.data.data;
}

export async function apiGetAdminUsers(page = 1): Promise<{ items: AdminUser[]; total: number; page: number; totalPages: number }> {
  const res = await api.get<{ data: AdminUser[]; meta: { total: number; page: number; totalPages: number } }>(`/admin/users?page=${page}`);
  return { items: res.data.data, ...res.data.meta };
}

export async function apiGetAdminAgents(): Promise<AdminAgent[]> {
  const res = await api.get<{ data: AdminAgent[] }>('/admin/agents');
  return res.data.data;
}

export async function apiUpdateAdminAgent(id: string, data: Partial<AdminAgent>): Promise<AdminAgent> {
  const res = await api.patch<{ data: AdminAgent }>(`/admin/agents/${id}`, data);
  return res.data.data;
}

export interface ApiCredits {
  openRouter: { usage: number; limit: number | null; remaining: number | null; expiresAt: string | null } | null;
  openAi: { status: string; note: string } | null;
}

export async function apiGetAdminCredits(): Promise<ApiCredits> {
  const res = await api.get<{ data: ApiCredits }>('/admin/credits');
  return res.data.data;
}

export async function apiGetAdminRuns(limit = 20): Promise<AdminRun[]> {
  const res = await api.get<{ data: AdminRun[] }>(`/admin/runs?limit=${limit}`);
  return res.data.data;
}
