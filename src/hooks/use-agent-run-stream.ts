"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { getAgentRunStreamUrl } from "@/lib/api/agent-runs";
import type {
  SSEStepStart,
  SSEToken,
  SSEStepComplete,
  SSERunComplete,
  SSERunError,
  AgentStepStatus,
} from "@/types/agent-run.types";

export interface StreamStep {
  id: string;
  role: string;
  agentId: string;
  output: string;
  tokenCount: number;
  durationMs: number;
  status: AgentStepStatus;
}

export interface StreamState {
  isConnected: boolean;
  isComplete: boolean;
  error: string | null;
  steps: StreamStep[];
  totalTokens: number;
  totalDurationMs: number;
}

const INITIAL_STATE: StreamState = {
  isConnected: false,
  isComplete: false,
  error: null,
  steps: [],
  totalTokens: 0,
  totalDurationMs: 0,
};

export function useAgentRunStream() {
  const [state, setState] = useState<StreamState>(INITIAL_STATE);
  const eventSourceRef = useRef<EventSource | null>(null);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setState((s) => ({ ...s, isConnected: false }));
  }, []);

  const connect = useCallback(
    (runId: string) => {
      disconnect();
      setState({ ...INITIAL_STATE, isConnected: true });

      const url = getAgentRunStreamUrl(runId);
      const es = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = es;

      es.addEventListener("step_start", (e) => {
        const data: SSEStepStart = JSON.parse(e.data);
        setState((s) => ({
          ...s,
          steps: [
            ...s.steps,
            {
              id: data.stepId,
              role: data.role,
              agentId: data.agentId,
              output: "",
              tokenCount: 0,
              durationMs: 0,
              status: "RUNNING",
            },
          ],
        }));
      });

      es.addEventListener("token", (e) => {
        const data: SSEToken = JSON.parse(e.data);
        setState((s) => ({
          ...s,
          steps: s.steps.map((step) =>
            step.id === data.stepId
              ? { ...step, output: step.output + data.token }
              : step,
          ),
        }));
      });

      es.addEventListener("step_complete", (e) => {
        const data: SSEStepComplete = JSON.parse(e.data);
        setState((s) => ({
          ...s,
          steps: s.steps.map((step) =>
            step.id === data.stepId
              ? {
                  ...step,
                  status: "COMPLETED" as const,
                  tokenCount: data.tokenCount,
                  durationMs: data.durationMs,
                }
              : step,
          ),
        }));
      });

      es.addEventListener("run_complete", (e) => {
        const data: SSERunComplete = JSON.parse(e.data);
        setState((s) => ({
          ...s,
          isConnected: false,
          isComplete: true,
          totalTokens: data.totalTokens,
          totalDurationMs: data.totalDurationMs,
        }));
        es.close();
        eventSourceRef.current = null;
      });

      es.addEventListener("run_error", (e) => {
        const data: SSERunError = JSON.parse(e.data);
        setState((s) => ({
          ...s,
          isConnected: false,
          isComplete: true,
          error: data.error,
        }));
        es.close();
        eventSourceRef.current = null;
      });

      es.onerror = () => {
        setState((s) => ({
          ...s,
          isConnected: false,
          error: s.error ?? "Connection lost. Reload to see results.",
        }));
        es.close();
        eventSourceRef.current = null;
      };
    },
    [disconnect],
  );

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return { ...state, connect, disconnect };
}
