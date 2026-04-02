"use client";

import React from "react";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "outline";
type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-ai-cloud text-ai-charcoal dark:bg-surface-tertiary dark:text-ai-cloud",
  primary:
    "bg-ai-primary-soft text-ai-primary dark:bg-ai-primary/15 dark:text-indigo-300",
  success:
    "bg-ai-success-light text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  warning:
    "bg-ai-warning-light text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  error:
    "bg-ai-error-light text-red-700 dark:bg-red-500/15 dark:text-red-300",
  info:
    "bg-ai-info-light text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  outline:
    "bg-transparent border border-border text-ai-graphite dark:text-ai-slate",
};

const dotColor: Record<BadgeVariant, string> = {
  default: "bg-ai-slate",
  primary: "bg-ai-primary",
  success: "bg-ai-success",
  warning: "bg-ai-warning",
  error: "bg-ai-error",
  info: "bg-ai-info",
  outline: "bg-ai-slate",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5 gap-1",
  md: "text-xs px-2 py-0.5 gap-1.5",
  lg: "text-sm px-2.5 py-1 gap-1.5",
};

export function Badge({
  variant = "default",
  size = "md",
  dot = false,
  icon,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center font-medium rounded-full whitespace-nowrap",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(" ")}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor[variant]}`} />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export default Badge;
