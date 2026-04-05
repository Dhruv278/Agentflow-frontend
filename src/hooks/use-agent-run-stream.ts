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
  isStale: boolean;
}

const INITIAL_STATE: StreamState = {
  isConnected: false,
  isComplete: false,
  error: null,
  steps: [],
  totalTokens: 0,
  totalDurationMs: 0,
  isStale: false,
};

const MAX_RETRIES = 5;
const INACTIVITY_TIMEOUT_MS = 60_000;

export function useAgentRunStream() {
  const [state, setState] = useState<StreamState>(INITIAL_STATE);
  const eventSourceRef = useRef<EventSource | null>(null);
  const isTerminalRef = useRef(false);
  const isUserDisconnectRef = useRef(false);
  const retryCountRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runIdRef = useRef<string | null>(null);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
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
    clearInactivityTimer();
    closeEventSource();
    setState((s) => ({ ...s, isConnected: false }));
  }, [clearRetryTimer, clearInactivityTimer, closeEventSource]);

  const resetInactivityTimer = useCallback(() => {
    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(() => {
      setState((s) => (s.isConnected ? { ...s, isStale: true } : s));
    }, INACTIVITY_TIMEOUT_MS);
  }, [clearInactivityTimer]);

  const openStream = useCallback(
    (runId: string) => {
      closeEventSource();
      setState((s) => ({ ...s, isConnected: true, isStale: false }));

      const url = getAgentRunStreamUrl(runId);
      const es = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = es;

      resetInactivityTimer();

      es.addEventListener("step_start", (e) => {
        resetInactivityTimer();
        const data: SSEStepStart = JSON.parse(e.data);
        setState((s) => {
          if (s.steps.some((step) => step.id === data.stepId)) return s;
          return {
            ...s,
            isStale: false,
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
          };
        });
      });

      es.addEventListener("token", (e) => {
        resetInactivityTimer();
        const data: SSEToken = JSON.parse(e.data);
        setState((s) => ({
          ...s,
          isStale: false,
          steps: s.steps.map((step) =>
            step.id === data.stepId
              ? { ...step, output: step.output + data.token }
              : step,
          ),
        }));
      });

      es.addEventListener("step_complete", (e) => {
        resetInactivityTimer();
        const data: SSEStepComplete = JSON.parse(e.data);
        setState((s) => ({
          ...s,
          isStale: false,
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
        clearInactivityTimer();
        const data: SSERunComplete = JSON.parse(e.data);
        isTerminalRef.current = true;
        setState((s) => ({
          ...s,
          isConnected: false,
          isComplete: true,
          isStale: false,
          totalTokens: data.totalTokens,
          totalDurationMs: data.totalDurationMs,
        }));
        es.close();
        eventSourceRef.current = null;
      });

      es.addEventListener("run_error", (e) => {
        clearInactivityTimer();
        const data: SSERunError = JSON.parse(e.data);
        isTerminalRef.current = true;
        setState((s) => ({
          ...s,
          isConnected: false,
          isComplete: true,
          isStale: false,
          error: data.error,
        }));
        es.close();
        eventSourceRef.current = null;
      });

      es.onerror = () => {
        clearInactivityTimer();
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
    [closeEventSource, resetInactivityTimer, clearInactivityTimer],
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
            isStale: false,
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
            isStale: false,
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
      clearInactivityTimer();
    };
  }, [closeEventSource, clearRetryTimer, clearInactivityTimer]);

  return { ...state, connect, disconnect };
}
