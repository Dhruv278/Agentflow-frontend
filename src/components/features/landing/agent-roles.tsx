"use client";

import React from "react";

const ROLES = [
  {
    name: "Researcher",
    emoji: "🔍",
    description: "Gathers data, finds sources, and synthesizes information from the web and past memory.",
    capabilities: ["Web research", "Source synthesis", "Data extraction", "Fact verification"],
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-200 dark:border-blue-800/40",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    tagColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    name: "Writer",
    emoji: "✍️",
    description: "Crafts well-structured content — articles, docs, emails, reports — using context from other agents.",
    capabilities: ["Blog posts", "Technical docs", "Email drafts", "Report writing"],
    color: "from-emerald-500 to-green-500",
    borderColor: "border-emerald-200 dark:border-emerald-800/40",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/20",
    tagColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    name: "Reviewer",
    emoji: "🔎",
    description: "Reviews outputs for accuracy, tone, and quality. Suggests improvements and catches errors.",
    capabilities: ["Fact checking", "Tone analysis", "Grammar review", "Quality scoring"],
    color: "from-amber-500 to-yellow-500",
    borderColor: "border-amber-200 dark:border-amber-800/40",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
    tagColor: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    name: "Coder",
    emoji: "💻",
    description: "Writes, debugs, and refactors code. Can generate scripts, APIs, components, and tests.",
    capabilities: ["Code generation", "Bug fixes", "API design", "Test writing"],
    color: "from-purple-500 to-violet-500",
    borderColor: "border-purple-200 dark:border-purple-800/40",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    tagColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
];

export function AgentRoles() {
  return (
    <section id="agents" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <p className="text-sm font-semibold text-ai-primary uppercase tracking-widest mb-3">
            Agent Roles
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ai-ink dark:text-white tracking-tight">
            Specialized agents for every task
          </h2>
          <p className="mt-4 text-lg text-ai-graphite dark:text-ai-slate leading-relaxed">
            Each agent brings a unique skill set to the team. Mix and match to build the perfect pipeline for your workflow.
          </p>
        </div>

        {/* Role cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {ROLES.map((role) => (
            <div
              key={role.name}
              className={`group relative rounded-2xl border ${role.borderColor} bg-surface p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Emoji + name */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`w-11 h-11 rounded-xl ${role.bgColor} flex items-center justify-center text-xl`}>
                  {role.emoji}
                </span>
                <h3 className="text-lg font-bold text-ai-ink dark:text-white">
                  {role.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-ai-graphite dark:text-ai-slate leading-relaxed mb-5">
                {role.description}
              </p>

              {/* Capabilities */}
              <div className="flex flex-wrap gap-1.5">
                {role.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${role.tagColor}`}
                  >
                    {cap}
                  </span>
                ))}
              </div>

              {/* Gradient accent line at top */}
              <div className={`absolute top-0 inset-x-6 h-0.5 rounded-full bg-gradient-to-r ${role.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>
          ))}
        </div>

        {/* Custom agent teaser */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-secondary border border-border text-sm text-ai-graphite dark:text-ai-slate">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-ai-primary">
              <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
            </svg>
            <span>
              Plus <span className="font-semibold text-ai-ink dark:text-white">Custom agents</span> — define your own roles & system prompts
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AgentRoles;
