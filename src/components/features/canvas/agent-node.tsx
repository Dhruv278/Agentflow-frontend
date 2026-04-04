"use client";

import React, { useCallback, useRef } from "react";
import { Badge } from "@/components/ui";
import type { CanvasNode } from "@/hooks/use-canvas-state";

const ROLE_COLOR: Record<string, string> = {
  RESEARCHER: "border-blue-400 dark:border-blue-500",
  WRITER: "border-purple-400 dark:border-purple-500",
  REVIEWER: "border-amber-400 dark:border-amber-500",
  CODER: "border-emerald-400 dark:border-emerald-500",
  CRITIC: "border-red-400 dark:border-red-500",
  CUSTOM: "border-gray-400 dark:border-gray-500",
};

interface AgentNodeProps {
  node: CanvasNode;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  onStartConnection: (nodeId: string) => void;
  onEndConnection: (nodeId: string) => void;
}

export function AgentNode({
  node,
  isSelected,
  onSelect,
  onMove,
  onDelete,
  onStartConnection,
  onEndConnection,
}: AgentNodeProps) {
  const dragRef = useRef<{ startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).dataset.handle) return;
      e.stopPropagation();
      onSelect(node.id);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        nodeX: node.x,
        nodeY: node.y,
      };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        onMove(node.id, dragRef.current.nodeX + dx, dragRef.current.nodeY + dy);
      };

      const handleMouseUp = () => {
        dragRef.current = null;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [node.id, node.x, node.y, onSelect, onMove],
  );

  return (
    <div
      className={[
        "group absolute w-52 rounded-xl border-2 bg-surface shadow-md transition-shadow select-none",
        ROLE_COLOR[node.role] ?? ROLE_COLOR.CUSTOM,
        isSelected ? "ring-2 ring-ai-primary shadow-lg" : "",
      ].join(" ")}
      style={{ left: node.x, top: node.y }}
      onMouseDown={handleMouseDown}
    >
      {/* Delete button (top-right) */}
      <button
        data-handle="delete"
        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 hover:opacity-100 hover:bg-red-600 transition-opacity z-20 cursor-pointer"
        style={{ opacity: isSelected ? 1 : undefined }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(node.id);
        }}
        title="Remove agent"
      >
        ✕
      </button>

      {/* Input handle (left) */}
      <div
        data-handle="input"
        className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white dark:bg-gray-800 border-2 border-ai-primary cursor-crosshair z-10 hover:scale-125 transition-transform"
        onMouseUp={(e) => {
          e.stopPropagation();
          onEndConnection(node.id);
        }}
      />

      {/* Content */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-1.5 mb-1">
          <Badge variant="primary" size="sm">{node.role}</Badge>
        </div>
        <p className="text-sm font-medium text-ai-ink dark:text-white truncate">
          {node.name}
        </p>
        <p className="text-xs text-ai-slate truncate">{node.description}</p>
      </div>

      {/* Output handle (right) */}
      <div
        data-handle="output"
        className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-ai-primary border-2 border-white dark:border-gray-800 cursor-crosshair z-10 hover:scale-125 transition-transform"
        onMouseDown={(e) => {
          e.stopPropagation();
          onStartConnection(node.id);
        }}
      />
    </div>
  );
}
