import api from './axios';
import type {
  TemplateTeam,
  TemplatesResponse,
  AgentTeam,
  UseTemplateResponse,
  AgentLibraryItem,
  AgentLibraryResponse,
  TeamGraph,
  TeamGraphResponse,
} from '@/types/agent.types';

export async function apiGetTemplates(): Promise<Record<string, TemplateTeam[]>> {
  const res = await api.get<TemplatesResponse>('/templates');
  return res.data.data;
}

export async function apiUseTemplate(templateId: string): Promise<AgentTeam> {
  const res = await api.post<UseTemplateResponse>(`/templates/${templateId}/use`);
  return res.data.data;
}

export async function apiGetAgentLibrary(): Promise<Record<string, AgentLibraryItem[]>> {
  const res = await api.get<AgentLibraryResponse>('/agent-library');
  return res.data.data;
}

export async function apiGetTeamGraph(teamId: string): Promise<TeamGraph> {
  const res = await api.get<TeamGraphResponse>(`/agent-teams/${teamId}/graph`);
  return res.data.data;
}

export async function apiSaveTeamGraph(
  teamId: string,
  graph: {
    agents: { role: string; systemPrompt: string; libraryItemId?: string; enabled?: boolean }[];
    connections: { fromAgentIndex: number; toAgentIndex: number; inputKey?: string }[];
    canvasLayout?: Record<string, unknown>;
  },
): Promise<TeamGraph> {
  const res = await api.post<TeamGraphResponse>(`/agent-teams/${teamId}/graph`, graph);
  return res.data.data;
}
