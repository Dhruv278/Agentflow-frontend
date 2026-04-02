"use client";

import React, { forwardRef, useId } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  selectSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: "h-8 text-sm pl-3 pr-8",
  md: "h-10 text-sm pl-3.5 pr-9",
  lg: "h-12 text-base pl-4 pr-10",
};

/* ── Chevron icon ── */
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      error,
      options,
      placeholder,
      selectSize = "md",
      fullWidth = true,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-ai-charcoal dark:text-ai-cloud"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={[
              "ai-focus-ring w-full rounded-lg font-normal appearance-none",
              "bg-surface border transition-all duration-200",
              error
                ? "border-ai-error/50 focus:border-ai-error focus:ring-2 focus:ring-ai-error/10"
                : "border-border hover:border-border-hover focus:border-ai-primary focus:ring-2 focus:ring-ai-primary/10",
              disabled ? "opacity-50 cursor-not-allowed bg-surface-secondary" : "cursor-pointer",
              "dark:bg-surface dark:text-ai-cloud",
              sizeStyles[selectSize],
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom chevron */}
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ai-slate pointer-events-none">
            <ChevronIcon className="w-4 h-4" />
          </span>
        </div>

        {(error || hint) && (
          <p className={`text-xs ${error ? "text-ai-error" : "text-ai-slate"}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
