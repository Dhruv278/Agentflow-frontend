"use client";

import React from "react";

/* ── Feature data ── */
const FEATURES = [
  {
    title: "Multi-Agent Teams",
    description:
      "Create teams of specialized AI agents — each with unique roles, system prompts, and capabilities — that collaborate sequentially on complex tasks.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" />
        <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
      </svg>
    ),
    gradient: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    title: "Real-Time Streaming",
    description:
      "Watch your agents think and write in real-time. Live token streaming via SSE so you see every step as it happens — no waiting for batch results.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50 dark:bg-amber-950/20",
  },
  {
    title: "Bring Your Own Key",
    description:
      "Use your own OpenRouter API key for unlimited runs at just $9/mo, or let the platform handle billing with included credits. Your key is AES-256 encrypted.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z" clipRule="evenodd" />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
  },
  {
    title: "Semantic Memory",
    description:
      "Your agents remember past conversations. Powered by vector embeddings, each agent recalls relevant context from previous runs automatically.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
      </svg>
    ),
    gradient: "from-purple-500 to-pink-500",
    bg: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    title: "Any LLM Model",
    description:
      "Access GPT-4, Claude, Gemini, Mistral, and more — all through a single OpenRouter endpoint. Pick the best model for each agent role.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M14.447 3.026a.75.75 0 0 1 .527.921l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.527ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06ZM7.28 6.22a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 0 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
      </svg>
    ),
    gradient: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50 dark:bg-indigo-950/20",
  },
  {
    title: "Flexible Pricing",
    description:
      "Start free with 10 runs/month. Scale to Pro for 500 runs, or go BYOK for unlimited. Only pay for what you need with transparent pricing.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z" clipRule="evenodd" />
      </svg>
    ),
    gradient: "from-rose-500 to-red-500",
    bg: "bg-rose-50 dark:bg-rose-950/20",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <p className="text-sm font-semibold text-ai-primary uppercase tracking-widest mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ai-ink dark:text-white tracking-tight">
            Everything you need to orchestrate AI
          </h2>
          <p className="mt-4 text-lg text-ai-graphite dark:text-ai-slate leading-relaxed">
            A complete platform for building, running, and managing multi-agent AI workflows — from simple tasks to complex pipelines.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="group relative p-6 sm:p-8 rounded-2xl border border-border bg-surface hover:shadow-lg hover:border-border-hover transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-5`}>
                <span className={`bg-gradient-to-br ${feature.gradient} bg-clip-text text-transparent`}>
                  {React.cloneElement(feature.icon as React.ReactElement, {
                    className: "w-6 h-6",
                    style: { fill: "url(#feat-grad-" + i + ")" },
                  })}
                </span>
                {/* Use actual coloring fallback */}
                <span className={`absolute opacity-0`}>
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient id={`feat-grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={feature.gradient.includes("blue") ? "#3b82f6" : feature.gradient.includes("amber") ? "#f59e0b" : feature.gradient.includes("emerald") ? "#10b981" : feature.gradient.includes("purple") ? "#a855f7" : feature.gradient.includes("indigo") ? "#6366f1" : "#f43f5e"} />
                        <stop offset="100%" stopColor={feature.gradient.includes("indigo") ? "#6366f1" : feature.gradient.includes("orange") ? "#f97316" : feature.gradient.includes("teal") ? "#14b8a6" : feature.gradient.includes("pink") ? "#ec4899" : feature.gradient.includes("violet") ? "#8b5cf6" : "#ef4444"} />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-ai-ink dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-ai-graphite dark:text-ai-slate leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
