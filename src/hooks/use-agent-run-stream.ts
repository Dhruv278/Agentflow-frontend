"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { getAgentRunStreamUrl, apiGetAgentRun } from "@/lib/api/agent-runs";
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

const MAX_RETRIES = 5;

export function useAgentRunStream() {
  const [state, setState] = useState<StreamState>(INITIAL_STATE);
  const eventSourceRef = useRef<EventSource | null>(null);
  const isTerminalRef = useRef(false);
  const isUserDisconnectRef = useRef(false);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runIdRef = useRef<string | null>(null);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const closeEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    isUserDisconnectRef.current = true;
    clearRetryTimer();
    closeEventSource();
    setState((s) => ({ ...s, isConnected: false }));
  }, [clearRetryTimer, closeEventSource]);

  const openStream = useCallback(
    (runId: string) => {
      closeEventSource();
      setState((s) => ({ ...s, isConnected: true }));

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
        isTerminalRef.current = true;
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
        isTerminalRef.current = true;
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
        es.close();
        eventSourceRef.current = null;
        setState((s) => ({ ...s, isConnected: false }));

        if (isTerminalRef.current || isUserDisconnectRef.current) return;

        const attempt = retryCountRef.current;
        if (attempt >= MAX_RETRIES) {
          setState((s) => ({
            ...s,
            error: s.error ?? "Connection lost after multiple retries.",
          }));
          return;
        }

        const delay = Math.min(1000 * Math.pow(2, attempt), 16000);
        retryCountRef.current = attempt + 1;
        retryTimerRef.current = setTimeout(() => reconnect(runId), delay);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [closeEventSource],
  );

  const reconnect = useCallback(
    async (runId: string) => {
      try {
        const run = await apiGetAgentRun(runId);

        if (run.status === "COMPLETED" || run.status === "FAILED") {
          isTerminalRef.current = true;
          setState({
            isConnected: false,
            isComplete: true,
            error: run.errorMessage ?? null,
            steps: run.steps.map((s) => ({
              id: s.id,
              role: s.role,
              agentId: "",
              output: s.output ?? "",
              tokenCount: s.tokenCount,
              durationMs: s.durationMs,
              status: s.status,
            })),
            totalTokens: run.totalTokensUsed,
            totalDurationMs: 0,
          });
          return;
        }

        // Run still active — hydrate completed steps, then reopen SSE
        setState((prev) => {
          const existingIds = new Set(prev.steps.map((s) => s.id));
          const newSteps = run.steps
            .filter((s) => !existingIds.has(s.id))
            .map((s) => ({
              id: s.id,
              role: s.role,
              agentId: "",
              output: s.output ?? "",
              tokenCount: s.tokenCount,
              durationMs: s.durationMs,
              status: s.status,
            }));
          return {
            ...prev,
            steps: [
              ...prev.steps.filter((s) => s.status === "COMPLETED"),
              ...newSteps,
            ],
          };
        });

        openStream(runId);
        retryCountRef.current = 0;
      } catch {
        const attempt = retryCountRef.current;
        if (attempt >= MAX_RETRIES) {
          setState((s) => ({
            ...s,
            error: s.error ?? "Connection lost after multiple retries.",
          }));
          return;
        }
        const delay = Math.min(1000 * Math.pow(2, attempt), 16000);
        retryCountRef.current = attempt + 1;
        retryTimerRef.current = setTimeout(() => reconnect(runId), delay);
      }
    },
    [openStream],
  );

  const connect = useCallback(
    (runId: string) => {
      disconnect();

      // Reset refs for new run
      isTerminalRef.current = false;
      isUserDisconnectRef.current = false;
      retryCountRef.current = 0;
      runIdRef.current = runId;

      setState({ ...INITIAL_STATE, isConnected: true });
      openStream(runId);
    },
    [disconnect, openStream],
  );

  useEffect(() => {
    return () => {
      closeEventSource();
      clearRetryTimer();
    };
  }, [closeEventSource, clearRetryTimer]);

  return { ...state, connect, disconnect };
}
