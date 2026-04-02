"use client";

import React from "react";

/* ── Card ── */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "outlined" | "filled" | "glass";
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
}

const variantStyles: Record<string, string> = {
  elevated: "bg-surface border border-border shadow-sm",
  outlined: "bg-surface border border-border",
  filled: "bg-surface-secondary border border-transparent",
  glass:
    "bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10",
};

const paddingStyles: Record<string, string> = {
  none: "",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Card({
  variant = "elevated",
  padding = "md",
  hoverable = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl transition-all duration-200",
        variantStyles[variant],
        paddingStyles[padding],
        hoverable
          ? "hover:shadow-md hover:border-border-hover hover:-translate-y-0.5 cursor-pointer"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Card Header ── */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardHeader({ className = "", children, ...props }: CardHeaderProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Card Title ── */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function CardTitle({
  as: Tag = "h3",
  className = "",
  children,
  ...props
}: CardTitleProps) {
  return (
    <Tag
      className={`text-lg font-semibold text-ai-ink dark:text-ai-cloud ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* ── Card Description ── */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export function CardDescription({
  className = "",
  children,
  ...props
}: CardDescriptionProps) {
  return (
    <p
      className={`text-sm text-ai-graphite dark:text-ai-slate leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}

/* ── Card Footer ── */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardFooter({ className = "", children, ...props }: CardFooterProps) {
  return (
    <div
      className={`flex items-center gap-3 mt-4 pt-4 border-t border-border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;
