"use client";

import React, { forwardRef, useState } from "react";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  onClear?: () => void;
  inputSize?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

const sizeMap = {
  sm: { wrapper: "h-8", text: "text-sm pl-8 pr-8", icon: "w-3.5 h-3.5" },
  md: { wrapper: "h-10", text: "text-sm pl-10 pr-10", icon: "w-4 h-4" },
  lg: { wrapper: "h-12", text: "text-base pl-12 pr-12", icon: "w-5 h-5" },
};

/* ── Search icon (inline SVG) ── */
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

/* ── Close / Clear icon ── */
function ClearIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      onClear,
      inputSize = "md",
      fullWidth = true,
      className = "",
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState("");
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = String(currentValue).length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) setInternalValue("");
      onClear?.();
    };

    const styles = sizeMap[inputSize];

    return (
      <div className={`relative ${fullWidth ? "w-full" : ""}`}>
        {/* Search icon */}
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ai-slate pointer-events-none">
          <SearchIcon className={styles.icon} />
        </span>

        <input
          ref={ref}
          type="search"
          value={currentValue}
          onChange={handleChange}
          placeholder="Search…"
          className={[
            "ai-focus-ring w-full rounded-full font-normal",
            "bg-surface-secondary border border-border",
            "transition-all duration-200",
            "placeholder:text-ai-slate",
            "hover:border-border-hover",
            "focus:border-ai-primary focus:ring-2 focus:ring-ai-primary/10 focus:bg-surface",
            "dark:bg-surface dark:text-ai-cloud",
            // Hide native search clear button
            "[&::-webkit-search-cancel-button]:hidden",
            styles.wrapper,
            styles.text,
            className,
          ].join(" ")}
          {...props}
        />

        {/* Clear button */}
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-ai-slate hover:text-ai-charcoal hover:bg-ai-cloud transition-colors dark:hover:text-ai-cloud dark:hover:bg-surface-tertiary cursor-pointer"
            aria-label="Clear search"
          >
            <ClearIcon className={styles.icon} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
export default SearchInput;
