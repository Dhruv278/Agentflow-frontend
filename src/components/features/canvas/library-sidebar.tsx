"use client";

import React, { useState } from "react";
import { Badge, SearchInput } from "@/components/ui";
import type { AgentLibraryItem, AgentRole } from "@/types/agent.types";

interface LibrarySidebarProps {
  library: Record<string, AgentLibraryItem[]>;
  onDragStart: (item: AgentLibraryItem) => void;
}

export function LibrarySidebar({ library, onDragStart }: LibrarySidebarProps) {
  const [search, setSearch] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const categories = Object.keys(library);

  const filteredLibrary: Record<string, AgentLibraryItem[]> = {};
  for (const cat of categories) {
    const filtered = library[cat].filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()),
    );
    if (filtered.length > 0) filteredLibrary[cat] = filtered;
  }

  return (
    <div className="w-64 shrink-0 border-r border-border bg-surface overflow-y-auto">
      <div className="p-3 border-b border-border">
        <h3 className="text-sm font-semibold text-ai-ink dark:text-white mb-2">
          Agent Library
        </h3>
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search agents..."
        />
      </div>

      <div className="p-2">
        {Object.keys(filteredLibrary).length === 0 ? (
          <p className="text-xs text-ai-slate p-2 text-center">No agents found</p>
        ) : (
          Object.entries(filteredLibrary).map(([category, items]) => (
            <div key={category} className="mb-2">
              <button
                className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-ai-graphite dark:text-ai-slate uppercase tracking-wider hover:text-ai-ink"
                onClick={() =>
                  setCollapsed((prev) => ({ ...prev, [category]: !prev[category] }))
                }
              >
                {category}
                <span>{collapsed[category] ? "+" : "−"}</span>
              </button>

              {!collapsed[category] && (
                <div className="space-y-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("application/json", JSON.stringify(item));
                        onDragStart(item);
                      }}
                      className="flex items-start gap-2 px-2 py-2 rounded-lg cursor-grab hover:bg-surface-secondary active:cursor-grabbing transition-colors"
                    >
                      <Badge variant="default" size="sm" className="shrink-0 mt-0.5">
                        {item.role}
                      </Badge>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ai-ink dark:text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-ai-slate truncate">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
