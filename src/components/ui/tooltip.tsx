"use client";

import React, { useState, useRef, useCallback } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: "top-full left-1/2 -translate-x-1/2 border-t-ai-ink dark:border-t-ai-cloud border-x-transparent border-b-transparent",
  bottom:
    "bottom-full left-1/2 -translate-x-1/2 border-b-ai-ink dark:border-b-ai-cloud border-x-transparent border-t-transparent",
  left: "left-full top-1/2 -translate-y-1/2 border-l-ai-ink dark:border-l-ai-cloud border-y-transparent border-r-transparent",
  right:
    "right-full top-1/2 -translate-y-1/2 border-r-ai-ink dark:border-r-ai-cloud border-y-transparent border-l-transparent",
};

export function Tooltip({
  content,
  position = "top",
  delay = 200,
  children,
  className = "",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  const show = useCallback(() => {
    timeout.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    setVisible(false);
  }, []);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={[
            "absolute z-50 whitespace-nowrap",
            "px-2.5 py-1.5 rounded-lg text-xs font-medium",
            "bg-ai-ink text-white dark:bg-ai-cloud dark:text-ai-ink",
            "shadow-lg pointer-events-none",
            "animate-[ai-fade-in_150ms_ease-out]",
            positionStyles[position],
          ].join(" ")}
        >
          {content}
          <span
            className={`absolute w-0 h-0 border-4 ${arrowStyles[position]}`}
          />
        </div>
      )}
    </div>
  );
}

export default Tooltip;
