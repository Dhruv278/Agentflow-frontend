"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { AgentNode } from "@/components/features/canvas/agent-node";
import { ConnectionLine, DragLine } from "@/components/features/canvas/connection-line";
import { LibrarySidebar } from "@/components/features/canvas/library-sidebar";
import { useCanvasState } from "@/hooks/use-canvas-state";
import { apiGetAgentTeam, apiUpdateAgentTeam } from "@/lib/api/agents";
import { apiGetAgentLibrary, apiGetTeamGraph, apiSaveTeamGraph } from "@/lib/api/templates";
import type { AgentLibraryItem, AgentRole } from "@/types/agent.types";

const NODE_WIDTH = 208;
const NODE_HEIGHT = 72;

export default function CanvasPage() {
  const params = useParams();
  const router = useRouter();
  const teamId = params.id as string;

  const canvas = useCanvasState();
  const [library, setLibrary] = useState<Record<string, AgentLibraryItem[]>>({});
  const [teamName, setTeamName] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [dragLinePos, setDragLinePos] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    Promise.all([
      apiGetAgentTeam(teamId),
      apiGetAgentLibrary(),
      apiGetTeamGraph(teamId),
    ])
      .then(([team, lib, graph]) => {
        setTeamName(team.name);
        setLibrary(lib);

        // Build a lookup from libraryItemId → {name, description}
        const libraryLookup = new Map<string, { name: string; description: string }>();
        for (const items of Object.values(lib)) {
          for (const item of items) {
            libraryLookup.set(item.id, { name: item.name, description: item.description });
          }
        }

        const layout = (graph.canvasLayout as { nodes?: { id: string; x: number; y: number }[] }) ?? {};
        const nodePositions = new Map((layout.nodes ?? []).map((n) => [n.id, { x: n.x, y: n.y }]));

        const loadedNodes = graph.agents.map((a, i) => {
          const libInfo = a.libraryItemId ? libraryLookup.get(a.libraryItemId) : null;
          return {
            id: a.id,
            role: a.role as AgentRole,
            name: libInfo?.name ?? a.role,
            description: libInfo?.description ?? "",
            systemPrompt: a.systemPrompt,
            libraryItemId: a.libraryItemId ?? undefined,
            x: nodePositions.get(a.id)?.x ?? 100 + i * 280,
            y: nodePositions.get(a.id)?.y ?? 150,
            enabled: a.enabled,
          };
        });

        const loadedConnections = graph.connections.map((c) => ({
          id: c.id,
          fromNodeId: c.fromAgentId,
          toNodeId: c.toAgentId,
          inputKey: c.inputKey,
        }));

        canvas.loadGraph(loadedNodes, loadedConnections);
      })
      .catch(() => setError("Failed to load canvas"))
      .finally(() => setPageLoading(false));
  }, [teamId]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;

      const item: AgentLibraryItem = JSON.parse(data);
      const rect = canvasRef.current?.getBoundingClientRect();
      const x = e.clientX - (rect?.left ?? 0) - NODE_WIDTH / 2;
      const y = e.clientY - (rect?.top ?? 0) - NODE_HEIGHT / 2;

      canvas.addNode(
        item.role as AgentRole,
        item.name,
        item.description,
        "",
        item.id,
        Math.max(0, x),
        Math.max(0, y),
      );
    },
    [canvas],
  );

  const handleStartConnection = useCallback((nodeId: string) => {
    setConnectingFrom(nodeId);
  }, []);

  const handleEndConnection = useCallback(
    (nodeId: string) => {
      if (connectingFrom && connectingFrom !== nodeId) {
        const ok = canvas.addConnection(connectingFrom, nodeId);
        if (!ok) {
          setError("Cannot create this connection — it would create a cycle.");
          setTimeout(() => setError(null), 3000);
        }
      }
      setConnectingFrom(null);
      setDragLinePos(null);
    },
    [connectingFrom, canvas],
  );

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (connectingFrom) {
        const rect = canvasRef.current?.getBoundingClientRect();
        setDragLinePos({
          x: e.clientX - (rect?.left ?? 0),
          y: e.clientY - (rect?.top ?? 0),
        });
      }
    },
    [connectingFrom],
  );

  const handleCanvasMouseUp = useCallback(() => {
    setConnectingFrom(null);
    setDragLinePos(null);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedConnection) {
          canvas.removeConnection(selectedConnection);
          setSelectedConnection(null);
        } else if (selectedNode) {
          canvas.removeNode(selectedNode);
          setSelectedNode(null);
        }
      }
    },
    [selectedNode, selectedConnection, canvas],
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const agents = canvas.nodes.map((n) => ({
        role: n.role,
        systemPrompt: n.systemPrompt,
        libraryItemId: n.libraryItemId,
        enabled: n.enabled,
      }));

      const nodeIdToIndex = new Map(canvas.nodes.map((n, i) => [n.id, i]));
      const connections = canvas.connections
        .map((c) => ({
          fromAgentIndex: nodeIdToIndex.get(c.fromNodeId) ?? -1,
          toAgentIndex: nodeIdToIndex.get(c.toNodeId) ?? -1,
          inputKey: c.inputKey,
        }))
        .filter((c) => c.fromAgentIndex >= 0 && c.toAgentIndex >= 0);

      const canvasLayout = {
        nodes: canvas.nodes.map((n) => ({ id: n.id, x: n.x, y: n.y })),
      };

      await apiSaveTeamGraph(teamId, { agents, connections, canvasLayout });
      canvas.markClean();
    } catch {
      setError("Failed to save workflow");
    } finally {
      setSaving(false);
    }
  }, [canvas, teamId]);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-ai-ink dark:text-white mb-2">
            Use a larger screen
          </p>
          <p className="text-sm text-ai-graphite dark:text-ai-slate">
            The workflow canvas requires a screen width of at least 768px.
          </p>
        </div>
      </div>
    );
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-ai-slate">Loading canvas...</div>
      </div>
    );
  }

  const connectingFromNode = connectingFrom
    ? canvas.nodes.find((n) => n.id === connectingFrom)
    : null;

  return (
    <div
      className="flex flex-col h-[calc(100vh-64px)]"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface shrink-0">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          onBlur={() => {
            if (teamName.trim()) {
              apiUpdateAgentTeam(teamId, { name: teamName.trim() }).catch(() => {});
            }
          }}
          className="text-base font-semibold text-ai-ink dark:text-white bg-transparent border-none outline-none focus:ring-1 focus:ring-ai-primary/40 rounded px-1 -ml-1 truncate max-w-xs"
          placeholder="Team name..."
        />
        <span className="text-xs text-ai-slate ml-2 shrink-0">
          {canvas.nodes.length} agent{canvas.nodes.length !== 1 ? "s" : ""} &middot; {canvas.connections.length} connection{canvas.connections.length !== 1 ? "s" : ""}
        </span>
        <div className="flex items-center gap-2">
          {canvas.isDirty && (
            <span className="w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes" />
          )}
          <Button
            variant="outline"
            size="sm"
            isLoading={saving}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push(`/agents/${teamId}/run`)}
          >
            Run Team
          </Button>
        </div>
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <LibrarySidebar library={library} onDragStart={() => {}} />

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-auto bg-[radial-gradient(circle,#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(circle,#374151_1px,transparent_1px)] bg-[size:24px_24px]"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onClick={() => {
            setSelectedNode(null);
            setSelectedConnection(null);
          }}
        >
          {/* SVG connections layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minWidth: 2000, minHeight: 1200 }}>
            <g className="pointer-events-auto">
              {canvas.connections.map((conn) => (
                <ConnectionLine
                  key={conn.id}
                  connection={conn}
                  nodes={canvas.nodes}
                  isSelected={selectedConnection === conn.id}
                  onClick={() => {
                    setSelectedConnection(conn.id);
                    setSelectedNode(null);
                  }}
                />
              ))}
              {connectingFromNode && dragLinePos && (
                <DragLine
                  fromX={connectingFromNode.x + NODE_WIDTH + 10}
                  fromY={connectingFromNode.y + NODE_HEIGHT / 2}
                  toX={dragLinePos.x}
                  toY={dragLinePos.y}
                />
              )}
            </g>
          </svg>

          {/* Nodes layer */}
          {canvas.nodes.map((node) => (
            <AgentNode
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              onSelect={(id) => {
                setSelectedNode(id);
                setSelectedConnection(null);
              }}
              onMove={canvas.moveNode}
              onDelete={(id) => {
                canvas.removeNode(id);
                setSelectedNode(null);
              }}
              onStartConnection={handleStartConnection}
              onEndConnection={handleEndConnection}
            />
          ))}

          {canvas.nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-sm text-ai-slate">
                Drag agents from the sidebar to start building your workflow
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
