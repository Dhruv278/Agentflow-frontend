export type AgentRunStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type AgentStepStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface AgentRunStep {
  id: string;
  role: string;
  output: string | null;
  tokenCount: number;
  durationMs: number;
  status: AgentStepStatus;
  createdAt: string;
}

export interface AgentRun {
  id: string;
  teamId: string;
  goal: string;
  model: string;
  status: AgentRunStatus;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
  totalTokensUsed: number;
  steps: AgentRunStep[];
  createdAt: string;
}

export interface AgentRunListItem {
  id: string;
  teamId: string;
  teamName: string;
  goal: string;
  model: string;
  status: AgentRunStatus;
  totalTokensUsed: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface CreateAgentRunInput {
  teamId: string;
  goal: string;
  model?: string;
}

export interface AgentRunResponse {
  data: AgentRun;
}

export interface AgentRunListResponse {
  data: AgentRunListItem[];
  meta: { total: number; page: number; totalPages: number };
}

export interface CreateAgentRunResponse {
  data: { runId: string };
}

export interface SSEStepStart {
  stepId: string;
  role: string;
  agentId: string;
}

export interface SSEToken {
  stepId: string;
  token: string;
}

export interface SSEStepComplete {
  stepId: string;
  role: string;
  tokenCount: number;
  durationMs: number;
}

export interface SSERunComplete {
  runId: string;
  totalTokens: number;
  totalDurationMs: number;
}

export interface SSERunError {
  runId: string;
  error: string;
}
