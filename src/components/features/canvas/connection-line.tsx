"use client";

import React from "react";
import type { CanvasNode, CanvasConnection } from "@/hooks/use-canvas-state";

const NODE_WIDTH = 208;
const NODE_HEIGHT = 72;

interface ConnectionLineProps {
  connection: CanvasConnection;
  nodes: CanvasNode[];
  isSelected: boolean;
  onClick: () => void;
}

export function ConnectionLine({
  connection,
  nodes,
  isSelected,
  onClick,
}: ConnectionLineProps) {
  const fromNode = nodes.find((n) => n.id === connection.fromNodeId);
  const toNode = nodes.find((n) => n.id === connection.toNodeId);

  if (!fromNode || !toNode) return null;

  const x1 = fromNode.x + NODE_WIDTH + 10;
  const y1 = fromNode.y + NODE_HEIGHT / 2;
  const x2 = toNode.x - 10;
  const y2 = toNode.y + NODE_HEIGHT / 2;

  const cpOffset = Math.max(50, Math.abs(x2 - x1) * 0.4);

  const d = `M ${x1} ${y1} C ${x1 + cpOffset} ${y1}, ${x2 - cpOffset} ${y2}, ${x2} ${y2}`;

  return (
    <g onClick={onClick} className="cursor-pointer">
      <path
        d={d}
        fill="none"
        stroke="transparent"
        strokeWidth={12}
      />
      <path
        d={d}
        fill="none"
        stroke={isSelected ? "#ef4444" : "#6366f1"}
        strokeWidth={isSelected ? 3 : 2}
        strokeDasharray={isSelected ? "6 4" : "none"}
        className="transition-colors"
      />
      <polygon
        points={`${x2 - 8},${y2 - 4} ${x2},${y2} ${x2 - 8},${y2 + 4}`}
        fill={isSelected ? "#ef4444" : "#6366f1"}
      />
    </g>
  );
}

interface DragLineProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

export function DragLine({ fromX, fromY, toX, toY }: DragLineProps) {
  const cpOffset = Math.max(30, Math.abs(toX - fromX) * 0.3);
  const d = `M ${fromX} ${fromY} C ${fromX + cpOffset} ${fromY}, ${toX - cpOffset} ${toY}, ${toX} ${toY}`;

  return (
    <path
      d={d}
      fill="none"
      stroke="#6366f1"
      strokeWidth={2}
      strokeDasharray="6 4"
      opacity={0.6}
    />
  );
}
