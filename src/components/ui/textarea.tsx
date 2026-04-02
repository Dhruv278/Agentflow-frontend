"use client";

import React, { forwardRef, useId } from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      fullWidth = true,
      className = "",
      id,
      disabled,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-ai-charcoal dark:text-ai-cloud"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          rows={rows}
          className={[
            "ai-focus-ring w-full rounded-xl font-normal resize-y",
            "bg-surface border transition-all duration-200",
            "text-sm px-4 py-3 leading-relaxed",
            "placeholder:text-ai-slate",
            error
              ? "border-ai-error/50 focus:border-ai-error focus:ring-2 focus:ring-ai-error/10"
              : "border-border hover:border-border-hover focus:border-ai-primary focus:ring-2 focus:ring-ai-primary/10",
            disabled ? "opacity-50 cursor-not-allowed bg-surface-secondary" : "",
            "dark:bg-surface dark:text-ai-cloud",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          {...props}
        />

        {(error || hint) && (
          <p className={`text-xs ${error ? "text-ai-error" : "text-ai-slate"}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
