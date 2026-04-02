"use client";

import React from "react";

const STEPS = [
  {
    step: "01",
    title: "Create Your Agent Team",
    description:
      "Define a team with specialized agents — assign roles like Researcher, Writer, Reviewer, or Coder. Customize each agent's system prompt and pick the ideal LLM model.",
    visual: (
      <div className="space-y-2.5">
        {[
          { role: "Researcher", prompt: "Find latest data on…", color: "bg-blue-500" },
          { role: "Writer", prompt: "Write a structured blog…", color: "bg-emerald-500" },
          { role: "Reviewer", prompt: "Check for accuracy and…", color: "bg-amber-500" },
        ].map((agent) => (
          <div key={agent.role} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-surface border border-border">
            <span className={`w-2 h-8 rounded-full ${agent.color}`} />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ai-ink dark:text-white">{agent.role}</p>
              <p className="text-xs text-ai-slate truncate">{agent.prompt}</p>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    step: "02",
    title: "Set Your Goal & Run",
    description:
      "Describe what you want accomplished in natural language. Hit run and each agent executes in sequence — the output of one becomes the context for the next.",
    visual: (
      <div className="space-y-3">
        <div className="p-3 rounded-xl bg-white dark:bg-surface border border-border">
          <p className="text-xs text-ai-slate mb-1.5">Goal</p>
          <p className="text-sm text-ai-ink dark:text-white font-medium">&quot;Research competitors and write a strategy doc&quot;</p>
        </div>
        <div className="flex items-center justify-center gap-2 py-2">
          <span className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="white" className="w-4 h-4">
              <path d="M3 3.732a1.5 1.5 0 0 1 2.305-1.265l6.706 4.267a1.5 1.5 0 0 1 0 2.531l-6.706 4.268A1.5 1.5 0 0 1 3 12.267V3.732Z" />
            </svg>
          </span>
          <p className="text-xs font-semibold text-ai-primary">Running pipeline…</p>
        </div>
        <div className="flex items-center gap-1">
          {["✓", "✓", "⏳", "○"].map((s, i) => (
            <React.Fragment key={i}>
              <span className={`w-7 h-7 rounded-full text-xs flex items-center justify-center font-bold ${s === "✓" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : s === "⏳" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 animate-pulse" : "bg-ai-cloud text-ai-slate dark:bg-surface-tertiary"}`}>
                {s}
              </span>
              {i < 3 && <span className="flex-1 h-px bg-border" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    ),
  },
  {
    step: "03",
    title: "Get Results in Real-Time",
    description:
      "Watch tokens stream live as each agent works. See the Researcher gather data, the Writer draft content, and the Reviewer polish it — all in your browser.",
    visual: (
      <div className="space-y-2">
        <div className="p-3 rounded-xl bg-white dark:bg-surface border border-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="white" className="w-3 h-3"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" /></svg>
            </span>
            <p className="text-xs font-semibold text-ai-ink dark:text-white">Researcher</p>
            <span className="text-[10px] text-ai-slate ml-auto">1,247 tokens</span>
          </div>
          <p className="text-xs text-ai-graphite dark:text-ai-slate leading-relaxed">
            Found 8 key competitors. Market size is $4.2B with 23% YoY growth…
          </p>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-surface border border-border">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
            <p className="text-xs font-semibold text-ai-ink dark:text-white">Writer</p>
            <span className="text-[10px] text-ai-slate ml-auto">streaming…</span>
          </div>
          <p className="text-xs text-ai-graphite dark:text-ai-slate leading-relaxed">
            Based on the research, our competitive analysis shows three key differentiators…<span className="animate-pulse">|</span>
          </p>
        </div>
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-surface-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <p className="text-sm font-semibold text-ai-primary uppercase tracking-widest mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ai-ink dark:text-white tracking-tight">
            Three steps to AI-powered results
          </h2>
          <p className="mt-4 text-lg text-ai-graphite dark:text-ai-slate leading-relaxed">
            Go from idea to finished output in minutes, not hours. No prompt engineering required.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
          {STEPS.map((step, i) => (
            <div key={i} className="relative">
              {/* Step number */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-4xl font-black text-ai-primary/10 dark:text-ai-primary/20 leading-none">
                  {step.step}
                </span>
                <h3 className="text-lg font-semibold text-ai-ink dark:text-white">
                  {step.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-sm text-ai-graphite dark:text-ai-slate leading-relaxed mb-6">
                {step.description}
              </p>

              {/* Visual */}
              <div className="p-4 rounded-2xl bg-surface-tertiary dark:bg-surface border border-border">
                {step.visual}
              </div>

              {/* Connector arrow (desktop only) */}
              {i < 2 && (
                <div className="hidden lg:block absolute top-12 -right-4 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-ai-silver">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
