"use client";

import React, { forwardRef, useId, useState } from "react";

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  hint?: string;
  error?: string;
  inputSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  showStrength?: boolean;
}

const sizeStyles = {
  sm: "h-8 text-sm px-3 pr-9",
  md: "h-10 text-sm px-3.5 pr-10",
  lg: "h-12 text-base px-4 pr-11",
};

const iconSizeMap = {
  sm: "w-4 h-4",
  md: "w-[18px] h-[18px]",
  lg: "w-5 h-5",
};

/* ── Eye icons ── */
function EyeIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" clipRule="evenodd" />
    </svg>
  );
}

function EyeSlashIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z" clipRule="evenodd" />
      <path d="M10.748 13.93l2.523 2.523a9.987 9.987 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
    </svg>
  );
}

/* ── Password strength meter ── */
function getStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 2) return { score, label: "Fair", color: "bg-amber-500" };
  if (score <= 3) return { score, label: "Good", color: "bg-blue-500" };
  return { score, label: "Strong", color: "bg-emerald-500" };
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      label,
      hint,
      error,
      inputSize = "md",
      fullWidth = true,
      showStrength = false,
      className = "",
      id,
      disabled,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [visible, setVisible] = useState(false);
    const [internalValue, setInternalValue] = useState("");

    const currentValue = (value ?? internalValue) as string;
    const strength = showStrength && currentValue.length > 0 ? getStrength(currentValue) : null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ai-charcoal dark:text-ai-cloud">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={visible ? "text" : "password"}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            className={[
              "ai-focus-ring w-full rounded-lg font-normal",
              "bg-surface border transition-all duration-200",
              "placeholder:text-ai-slate",
              error
                ? "border-ai-error/50 focus:border-ai-error focus:ring-2 focus:ring-ai-error/10"
                : "border-border hover:border-border-hover focus:border-ai-primary focus:ring-2 focus:ring-ai-primary/10",
              disabled ? "opacity-50 cursor-not-allowed bg-surface-secondary" : "",
              sizeStyles[inputSize],
              "dark:bg-surface dark:text-ai-cloud",
              className,
            ]
              .filter(Boolean)
              .join(" ")}
            {...props}
          />

          {/* Toggle visibility button */}
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setVisible(!visible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ai-slate hover:text-ai-charcoal dark:hover:text-ai-cloud transition-colors cursor-pointer"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? (
              <EyeSlashIcon className={iconSizeMap[inputSize]} />
            ) : (
              <EyeIcon className={iconSizeMap[inputSize]} />
            )}
          </button>
        </div>

        {/* Strength meter */}
        {strength && (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    i <= strength.score ? strength.color : "bg-ai-cloud dark:bg-surface-tertiary"
                  }`}
                />
              ))}
            </div>
            <span className={`text-[11px] font-medium ${
              strength.score <= 1 ? "text-red-500" : strength.score <= 2 ? "text-amber-500" : strength.score <= 3 ? "text-blue-500" : "text-emerald-500"
            }`}>
              {strength.label}
            </span>
          </div>
        )}

        {(error || hint) && (
          <p className={`text-xs ${error ? "text-ai-error" : "text-ai-slate"}`}>
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
