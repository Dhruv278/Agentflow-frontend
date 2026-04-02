"use client";

import React from "react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  isAI?: boolean;
}

const sizeStyles: Record<AvatarSize, string> = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ── AI sparkle icon ── */
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Avatar({
  src,
  alt,
  name,
  size = "md",
  isAI = false,
  className = "",
  ...props
}: AvatarProps) {
  const showImage = !!src;
  const showInitials = !src && !!name;

  return (
    <div
      className={[
        "relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0",
        "font-semibold select-none",
        isAI
          ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-400 text-white"
          : showInitials
            ? "bg-ai-primary-light text-ai-primary dark:bg-ai-primary/20"
            : "bg-ai-cloud dark:bg-surface-tertiary",
        sizeStyles[size],
        className,
      ].join(" ")}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? name ?? "Avatar"}
          className="w-full h-full object-cover"
        />
      ) : isAI ? (
        <SparkleIcon className="w-1/2 h-1/2" />
      ) : showInitials ? (
        <span>{getInitials(name)}</span>
      ) : (
        /* Default person icon */
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-1/2 h-1/2 text-ai-slate"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
            clipRule="evenodd"
          />
        </svg>
      )}

      {/* Online / AI indicator ring */}
      {isAI && (
        <span className="absolute -bottom-0.5 -right-0.5 block rounded-full bg-ai-success ring-2 ring-surface w-1/4 h-1/4 min-w-[8px] min-h-[8px]" />
      )}
    </div>
  );
}

export default Avatar;
