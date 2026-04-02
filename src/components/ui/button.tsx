"use client";

import React, { forwardRef } from "react";

/* ── Types ── */
type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "gradient";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/* ── Style maps ── */
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ai-primary text-white hover:bg-ai-primary-hover active:bg-indigo-700 shadow-sm hover:shadow-md",
  secondary:
    "bg-surface-secondary text-ai-charcoal border border-border hover:bg-surface-tertiary hover:border-border-hover active:bg-ai-cloud dark:text-ai-cloud",
  ghost:
    "bg-transparent text-ai-graphite hover:bg-surface-tertiary hover:text-ai-charcoal active:bg-ai-cloud dark:text-ai-slate dark:hover:text-ai-cloud",
  outline:
    "bg-transparent text-ai-primary border border-ai-primary/30 hover:bg-ai-primary-soft hover:border-ai-primary/50 active:bg-ai-primary-light",
  danger:
    "bg-ai-error text-white hover:bg-red-600 active:bg-red-700 shadow-sm",
  gradient:
    "bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-400 text-white hover:from-indigo-600 hover:via-purple-600 hover:to-violet-500 shadow-md hover:shadow-lg",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "h-7 px-2.5 text-xs gap-1 rounded-md",
  sm: "h-8 px-3 text-sm gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-11 px-5 text-base gap-2 rounded-xl",
  xl: "h-12 px-6 text-base gap-2.5 rounded-xl",
};

/* ── Loading spinner ── */
function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${className ?? ""}`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1 w-1 rounded-full bg-current"
          style={{
            animation: "ai-bounce-dot 1.4s infinite ease-in-out both",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </span>
  );
}

/* ── Button component ── */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          // Base
          "ai-focus-ring inline-flex items-center justify-center font-medium",
          "transition-all duration-200 ease-in-out",
          "select-none cursor-pointer",
          // Variant + size
          variantStyles[variant],
          sizeStyles[size],
          // Full width
          fullWidth ? "w-full" : "",
          // Disabled
          isDisabled ? "opacity-50 pointer-events-none cursor-not-allowed" : "",
          // Custom
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {isLoading ? (
          <LoadingDots />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
