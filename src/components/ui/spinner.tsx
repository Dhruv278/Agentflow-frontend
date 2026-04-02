"use client";

import React from "react";

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerVariant = "ring" | "dots" | "pulse";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
}

const ringSize: Record<SpinnerSize, string> = {
  xs: "w-4 h-4 border-[2px]",
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-[2.5px]",
  lg: "w-10 h-10 border-[3px]",
  xl: "w-14 h-14 border-[3px]",
};

const dotSize: Record<SpinnerSize, string> = {
  xs: "w-1 h-1",
  sm: "w-1.5 h-1.5",
  md: "w-2 h-2",
  lg: "w-2.5 h-2.5",
  xl: "w-3 h-3",
};

const dotGap: Record<SpinnerSize, string> = {
  xs: "gap-1",
  sm: "gap-1",
  md: "gap-1.5",
  lg: "gap-2",
  xl: "gap-2.5",
};

const pulseSize: Record<SpinnerSize, string> = {
  xs: "w-4 h-4",
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-14 h-14",
};

/* ── Ring spinner ── */
function RingSpinner({ size }: { size: SpinnerSize }) {
  return (
    <div
      className={[
        "rounded-full border-ai-primary/20 border-t-ai-primary",
        ringSize[size],
      ].join(" ")}
      style={{ animation: "ai-spin 0.8s linear infinite" }}
    />
  );
}

/* ── Dots spinner ── */
function DotsSpinner({ size }: { size: SpinnerSize }) {
  return (
    <div className={`flex items-center ${dotGap[size]}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`rounded-full bg-ai-primary ${dotSize[size]}`}
          style={{
            animation: "ai-bounce-dot 1.4s infinite ease-in-out both",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Pulse spinner (AI-themed) ── */
function PulseSpinner({ size }: { size: SpinnerSize }) {
  return (
    <div className={`relative ${pulseSize[size]}`}>
      <div
        className="absolute inset-0 rounded-full bg-ai-primary/30"
        style={{ animation: "ai-pulse-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
      </div>
    </div>
  );
}

export function Spinner({
  size = "md",
  variant = "ring",
  label,
  className = "",
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label ?? "Loading"}
      className={`inline-flex flex-col items-center gap-2 ${className}`}
      {...props}
    >
      {variant === "ring" && <RingSpinner size={size} />}
      {variant === "dots" && <DotsSpinner size={size} />}
      {variant === "pulse" && <PulseSpinner size={size} />}
      {label && (
        <span className="text-xs text-ai-slate font-medium">{label}</span>
      )}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default Spinner;
