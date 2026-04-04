import api from './axios';
import type {
  AgentTeam,
  AgentTeamListItem,
  AgentTeamResponse,
  AgentTeamListResponse,
  CreateAgentTeamInput,
  UpdateAgentTeamInput,
} from '@/types/agent.types';

export async function apiCreateAgentTeam(
  input: CreateAgentTeamInput,
): Promise<AgentTeam> {
  const res = await api.post<AgentTeamResponse>('/agent-teams', input);
  return res.data.data;
}

export async function apiGetAgentTeams(
  page = 1,
  limit = 20,
): Promise<{ items: AgentTeamListItem[]; total: number; page: number; totalPages: number }> {
  const res = await api.get<AgentTeamListResponse>(
    `/agent-teams?page=${page}&limit=${limit}`,
  );
  return { items: res.data.data, ...res.data.meta };
}

export async function apiGetAgentTeam(id: string): Promise<AgentTeam> {
  const res = await api.get<AgentTeamResponse>(`/agent-teams/${id}`);
  return res.data.data;
}

export async function apiUpdateAgentTeam(
  id: string,
  input: UpdateAgentTeamInput,
): Promise<AgentTeam> {
  const res = await api.patch<AgentTeamResponse>(`/agent-teams/${id}`, input);
  return res.data.data;
}

export async function apiDeleteAgentTeam(id: string): Promise<void> {
  await api.delete(`/agent-teams/${id}`);
}

export async function apiCreateCustomAgent(input: {
  name: string;
  description: string;
  role: string;
  category: string;
  systemPrompt: string;
}): Promise<unknown> {
  const res = await api.post('/agent-library', input);
  return res.data.data;
}
