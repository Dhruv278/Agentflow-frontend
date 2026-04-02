"use client";

import React from "react";
import Link from "next/link";
import { Button, Badge } from "@/components/ui";

/* ── Icons ── */
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-4 h-4"}>
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-4 h-4"}>
      <path fillRule="evenodd" d="M2 10a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm6.39-2.908a.75.75 0 0 1 .766.027l3.5 2.25a.75.75 0 0 1 0 1.262l-3.5 2.25A.75.75 0 0 1 8 12.25v-4.5a.75.75 0 0 1 .39-.658Z" clipRule="evenodd" />
    </svg>
  );
}

/* ── Floating agent cards for visual decoration ── */
function FloatingAgentCard({
  role,
  emoji,
  color,
  position,
}: {
  role: string;
  emoji: string;
  color: string;
  position: string;
}) {
  return (
    <div
      className={`absolute ${position} hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-surface border border-border shadow-lg animate-[ai-fade-in_600ms_ease-out]`}
    >
      <span className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center text-sm`}>
        {emoji}
      </span>
      <div>
        <p className="text-xs font-semibold text-ai-ink dark:text-white">{role}</p>
        <p className="text-[10px] text-ai-slate">Active</p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-24">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-indigo-950/20 dark:via-background dark:to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.12),transparent)]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none' stroke='%236366f1' stroke-width='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating agent cards */}
      <FloatingAgentCard role="Researcher" emoji="🔍" color="bg-blue-100 dark:bg-blue-900/30" position="top-44 left-[8%]" />
      <FloatingAgentCard role="Writer" emoji="✍️" color="bg-emerald-100 dark:bg-emerald-900/30" position="top-56 right-[6%]" />
      <FloatingAgentCard role="Reviewer" emoji="🔎" color="bg-amber-100 dark:bg-amber-900/30" position="bottom-32 left-[12%]" />
      <FloatingAgentCard role="Coder" emoji="💻" color="bg-purple-100 dark:bg-purple-900/30" position="bottom-24 right-[10%]" />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <Badge variant="primary" size="lg" icon={
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
              <path d="M7.657 3.138a.75.75 0 0 1 .686 0l4.5 2.25a.75.75 0 0 1 0 1.224l-4.5 2.25a.75.75 0 0 1-.686 0l-4.5-2.25a.75.75 0 0 1 0-1.224l4.5-2.25Z" />
              <path d="M2.36 7.706a.75.75 0 0 1 1.03-.258L8 10.2l4.61-2.752a.75.75 0 1 1 .772 1.286l-5 2.986a.75.75 0 0 1-.764 0l-5-2.986a.75.75 0 0 1-.258-1.028Z" />
            </svg>
          }>
            Multi-Agent Orchestration
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ai-ink dark:text-white leading-[1.1]">
          Build AI Agent Teams{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
            That Think Together
          </span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg sm:text-xl text-ai-graphite dark:text-ai-slate max-w-2xl mx-auto leading-relaxed">
          Create teams of specialized AI agents — Researcher, Writer, Reviewer, Coder — that collaborate on a single goal.
          Bring your own API key or use platform credits.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link href="/register">
            <Button variant="gradient" size="xl" rightIcon={<ArrowRightIcon />}>
              Start Building for Free
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="secondary" size="xl" leftIcon={<PlayIcon />}>
              See How It Works
            </Button>
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="flex -space-x-2">
            {["DG", "AK", "SM", "JR", "PL"].map((initials, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-background bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white"
              >
                {initials}
              </div>
            ))}
          </div>
          <p className="text-sm text-ai-slate">
            Trusted by <span className="font-semibold text-ai-charcoal dark:text-ai-cloud">2,400+</span> developers & teams
          </p>
        </div>
      </div>

      {/* Hero visual — mock terminal / chat preview */}
      <div className="relative max-w-3xl mx-auto mt-16 px-4 sm:px-6">
        <div className="rounded-2xl border border-border bg-white dark:bg-surface shadow-xl overflow-hidden">
          {/* Terminal header bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-secondary">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-emerald-400" />
            <span className="ml-3 text-xs text-ai-slate font-mono">AgentFlow — Live Run</span>
          </div>

          {/* Pipeline visualization */}
          <div className="p-4 sm:p-6 space-y-3">
            {/* Goal */}
            <div className="flex items-start gap-3 pb-4 border-b border-border">
              <span className="shrink-0 w-6 h-6 rounded-full bg-ai-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="white" className="w-3.5 h-3.5">
                  <path d="M8 1a.75.75 0 0 1 .75.75v.186c2.478.27 4.405 2.197 4.674 4.675h.186a.75.75 0 0 1 0 1.5h-.207a5.002 5.002 0 0 1-4.653 4.639v.194a.75.75 0 0 1-1.5 0v-.186a5.003 5.003 0 0 1-4.674-4.648H2.39a.75.75 0 0 1 0-1.5h.194A5.003 5.003 0 0 1 7.25 1.936V1.75A.75.75 0 0 1 8 1Zm0 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0 2a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
              </span>
              <div>
                <p className="text-xs font-medium text-ai-slate">Goal</p>
                <p className="text-sm font-medium text-ai-ink dark:text-white">&quot;Research and write a blog post about AI agents in 2026&quot;</p>
              </div>
            </div>

            {/* Agent steps */}
            {[
              { role: "Researcher", status: "done", color: "bg-blue-500", tokens: "1,247", output: "Found 12 relevant sources on multi-agent systems, LLM orchestration..." },
              { role: "Writer", status: "done", color: "bg-emerald-500", tokens: "2,103", output: "Draft complete: \"The Rise of AI Agent Teams\" — 1,200 words, 4 sections..." },
              { role: "Reviewer", status: "active", color: "bg-amber-500", tokens: "856", output: "Reviewing for accuracy, tone, and structure..." },
              { role: "Coder", status: "queued", color: "bg-purple-500", tokens: "—", output: "Waiting for previous steps..." },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className={`shrink-0 w-6 h-6 rounded-full ${step.color} flex items-center justify-center`}>
                    {step.status === "done" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="white" className="w-3.5 h-3.5"><path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" /></svg>
                    ) : step.status === "active" ? (
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white/40" />
                    )}
                  </span>
                  {i < 3 && <span className="w-px h-6 bg-border" />}
                </div>
                <div className={`flex-1 min-w-0 ${step.status === "queued" ? "opacity-40" : ""}`}>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ai-ink dark:text-white">{step.role}</p>
                    <span className="text-[10px] text-ai-slate font-mono">{step.tokens} tokens</span>
                    {step.status === "active" && (
                      <Badge variant="warning" size="sm">Running</Badge>
                    )}
                  </div>
                  <p className="text-xs text-ai-graphite dark:text-ai-slate mt-0.5 truncate">{step.output}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Glow effect behind the card */}
        <div className="absolute -inset-4 -z-10 bg-gradient-to-r from-indigo-500/5 via-purple-500/10 to-violet-500/5 rounded-3xl blur-2xl" />
      </div>
    </section>
  );
}

export default Hero;
