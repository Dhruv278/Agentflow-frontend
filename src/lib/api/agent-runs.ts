import api from './axios';
import type {
  AgentRun,
  AgentRunListItem,
  AgentRunResponse,
  AgentRunListResponse,
  CreateAgentRunInput,
  CreateAgentRunResponse,
} from '@/types/agent-run.types';

export async function apiCreateAgentRun(
  input: CreateAgentRunInput,
): Promise<string> {
  const res = await api.post<CreateAgentRunResponse>('/agent-runs', input);
  return res.data.data.runId;
}

export async function apiGetAgentRuns(
  page = 1,
  limit = 20,
): Promise<{ items: AgentRunListItem[]; total: number; page: number; totalPages: number }> {
  const res = await api.get<AgentRunListResponse>(
    `/agent-runs?page=${page}&limit=${limit}`,
  );
  return { items: res.data.data, ...res.data.meta };
}

export async function apiGetAgentRun(id: string): Promise<AgentRun> {
  const res = await api.get<AgentRunResponse>(`/agent-runs/${id}`);
  return res.data.data;
}

export function getAgentRunStreamUrl(runId: string): string {
  const baseUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:3001';
  return `${baseUrl}/agent-runs/${runId}/stream`;
}
