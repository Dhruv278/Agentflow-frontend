export type AgentRole = 'RESEARCHER' | 'WRITER' | 'REVIEWER' | 'CODER' | 'CRITIC' | 'CUSTOM';

export interface Agent {
  id: string;
  role: AgentRole;
  systemPrompt: string;
  order: number;
  enabled: boolean;
  libraryItemId: string | null;
  createdAt: string;
}

export interface AgentTeam {
  id: string;
  name: string;
  description: string | null;
  goal: string;
  model: string;
  agents: Agent[];
  createdAt: string;
  updatedAt: string;
}

export interface AgentTeamListItem {
  id: string;
  name: string;
  description: string | null;
  goal: string;
  model: string;
  agentCount: number;
  lastRunAt: string | null;
  createdAt: string;
}

export interface CreateAgentInput {
  role: AgentRole;
  systemPrompt: string;
  order: number;
  enabled?: boolean;
}

export interface CreateAgentTeamInput {
  name: string;
  description?: string;
  goal: string;
  model?: string;
  agents: CreateAgentInput[];
}

export interface UpdateAgentTeamInput {
  name?: string;
  description?: string;
  goal?: string;
  model?: string;
  agents?: CreateAgentInput[];
}

export interface AgentTeamResponse {
  data: AgentTeam;
}

export interface AgentTeamListResponse {
  data: AgentTeamListItem[];
  meta: { total: number; page: number; totalPages: number };
}

// ─── Agent Library ───

export interface AgentLibraryItem {
  id: string;
  name: string;
  description: string;
  role: AgentRole;
  category: string;
  usageCount: number;
  createdAt: string;
}

export interface AgentLibraryResponse {
  data: Record<string, AgentLibraryItem[]>;
}

// ─── Agent Connections ───

export interface AgentConnection {
  id: string;
  fromAgentId: string;
  toAgentId: string;
  inputKey: string;
}

export interface TeamGraph {
  agents: Agent[];
  connections: AgentConnection[];
  canvasLayout: Record<string, unknown> | null;
}

export interface TeamGraphResponse {
  data: TeamGraph;
}

// ─── Templates ───

export interface TemplateTeam {
  id: string;
  name: string;
  description: string | null;
  goal: string;
  model: string;
  category: string | null;
  agents: { id: string; role: AgentRole; order: number }[];
}

export interface TemplatesResponse {
  data: Record<string, TemplateTeam[]>;
}

export interface UseTemplateResponse {
  data: AgentTeam;
}
