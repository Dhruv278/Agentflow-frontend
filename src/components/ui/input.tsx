"use client";

import React, { forwardRef, useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  inputSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: "h-8 text-sm px-3",
  md: "h-10 text-sm px-3.5",
  lg: "h-12 text-base px-4",
};

const iconPaddingLeft = {
  sm: "pl-8",
  md: "pl-10",
  lg: "pl-11",
};

const iconPaddingRight = {
  sm: "pr-8",
  md: "pr-10",
  lg: "pr-11",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      leftIcon,
      rightIcon,
      inputSize = "md",
      fullWidth = true,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-ai-charcoal dark:text-ai-cloud"
          >
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ai-slate pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={[
              // Base
              "ai-focus-ring w-full rounded-lg font-normal",
              "bg-surface border transition-all duration-200",
              "placeholder:text-ai-slate",
              // States
              error
                ? "border-ai-error/50 focus:border-ai-error focus:ring-2 focus:ring-ai-error/10"
                : "border-border hover:border-border-hover focus:border-ai-primary focus:ring-2 focus:ring-ai-primary/10",
              // Disabled
              disabled ? "opacity-50 cursor-not-allowed bg-surface-secondary" : "",
              // Size
              sizeStyles[inputSize],
              // Icon padding
              leftIcon ? iconPaddingLeft[inputSize] : "",
              rightIcon ? iconPaddingRight[inputSize] : "",
              // Dark mode
              "dark:bg-surface dark:text-ai-cloud",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ai-slate">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Hint / Error */}
        {(error || hint) && (
          <p
            className={`text-xs ${
              error ? "text-ai-error" : "text-ai-slate"
            }`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
