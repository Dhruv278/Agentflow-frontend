"use client";

import { useState, useCallback } from "react";
import type { AgentRole } from "@/types/agent.types";

export interface CanvasNode {
  id: string;
  role: AgentRole;
  name: string;
  description: string;
  systemPrompt: string;
  libraryItemId?: string;
  x: number;
  y: number;
  enabled: boolean;
}

export interface CanvasConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  inputKey: string;
}

export interface CanvasState {
  nodes: CanvasNode[];
  connections: CanvasConnection[];
  isDirty: boolean;
}

let nextId = 1;
function genId(): string {
  return `canvas-${Date.now()}-${nextId++}`;
}

function wouldCreateCycle(
  connections: CanvasConnection[],
  fromId: string,
  toId: string,
): boolean {
  const adj = new Map<string, string[]>();
  for (const c of connections) {
    if (!adj.has(c.fromNodeId)) adj.set(c.fromNodeId, []);
    adj.get(c.fromNodeId)!.push(c.toNodeId);
  }
  if (!adj.has(fromId)) adj.set(fromId, []);
  adj.get(fromId)!.push(toId);

  const visited = new Set<string>();
  const inStack = new Set<string>();

  function dfs(node: string): boolean {
    if (inStack.has(node)) return true;
    if (visited.has(node)) return false;
    visited.add(node);
    inStack.add(node);
    for (const child of adj.get(node) ?? []) {
      if (dfs(child)) return true;
    }
    inStack.delete(node);
    return false;
  }

  for (const node of adj.keys()) {
    if (dfs(node)) return true;
  }
  return false;
}

export function useCanvasState() {
  const [nodes, setNodes] = useState<CanvasNode[]>([]);
  const [connections, setConnections] = useState<CanvasConnection[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const addNode = useCallback(
    (
      role: AgentRole,
      name: string,
      description: string,
      systemPrompt: string,
      libraryItemId: string | undefined,
      x: number,
      y: number,
    ) => {
      const node: CanvasNode = {
        id: genId(),
        role,
        name,
        description,
        systemPrompt,
        libraryItemId,
        x,
        y,
        enabled: true,
      };
      setNodes((prev) => [...prev, node]);
      setIsDirty(true);
      return node.id;
    },
    [],
  );

  const removeNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== nodeId));
    setConnections((prev) =>
      prev.filter((c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId),
    );
    setIsDirty(true);
  }, []);

  const moveNode = useCallback((nodeId: string, x: number, y: number) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n)),
    );
    setIsDirty(true);
  }, []);

  const addConnection = useCallback(
    (fromNodeId: string, toNodeId: string): boolean => {
      if (fromNodeId === toNodeId) return false;

      const exists = connections.some(
        (c) => c.fromNodeId === fromNodeId && c.toNodeId === toNodeId,
      );
      if (exists) return false;

      if (wouldCreateCycle(connections, fromNodeId, toNodeId)) {
        return false;
      }

      const conn: CanvasConnection = {
        id: genId(),
        fromNodeId,
        toNodeId,
        inputKey: "output",
      };
      setConnections((prev) => [...prev, conn]);
      setIsDirty(true);
      return true;
    },
    [connections],
  );

  const removeConnection = useCallback((connId: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== connId));
    setIsDirty(true);
  }, []);

  const loadGraph = useCallback(
    (
      loadedNodes: CanvasNode[],
      loadedConnections: CanvasConnection[],
    ) => {
      setNodes(loadedNodes);
      setConnections(loadedConnections);
      setIsDirty(false);
    },
    [],
  );

  const markClean = useCallback(() => setIsDirty(false), []);

  return {
    nodes,
    connections,
    isDirty,
    addNode,
    removeNode,
    moveNode,
    addConnection,
    removeConnection,
    loadGraph,
    markClean,
  };
}
