"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

/* ── Check icon ── */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-4 h-4"}>
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
  );
}

/* ── Sparkle icon for badge ── */
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-3.5 h-3.5"}>
      <path d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" />
    </svg>
  );
}

type PlanKey = "free" | "pro" | "byok";

interface PlanData {
  key: PlanKey;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  ctaVariant: "secondary" | "gradient" | "outline";
  badge?: string;
}

const PLANS: PlanData[] = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with AI agent teams at no cost.",
    features: [
      "1 agent team",
      "10 runs / month",
      "Mistral 7B model",
      "Basic agent memory",
      "Community support",
    ],
    cta: "Start Free",
    ctaVariant: "secondary",
  },
  {
    key: "pro",
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For power users who need more agents and models.",
    features: [
      "10 agent teams",
      "500 runs / month",
      "All LLM models (GPT-4, Claude, etc.)",
      "Advanced semantic memory",
      "Priority support",
      "BYOK optional",
    ],
    cta: "Upgrade to Pro",
    ctaVariant: "gradient",
    badge: "Most Popular",
  },
  {
    key: "byok",
    name: "BYOK",
    price: "$9",
    period: "/month",
    description: "Bring your own OpenRouter key for unlimited runs.",
    features: [
      "Unlimited agent teams",
      "Unlimited runs",
      "All LLM models",
      "Advanced semantic memory",
      "Priority support",
      "AES-256 encrypted key storage",
    ],
    cta: "Get BYOK",
    ctaVariant: "outline",
  },
];

/* ── Single pricing card ── */
function PricingCard({
  plan,
  isSelected,
  onSelect,
  index,
}: {
  plan: PlanData;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}) {
  const isHighlighted = plan.badge != null;

  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={[
        "group relative rounded-2xl p-6 sm:p-8 cursor-pointer select-none outline-none",
        // Entrance animation — staggered
        "animate-[ai-fade-in_500ms_ease-out_both]",
        // Transition for all interactive states
        "transition-all duration-300 ease-out",
        // Selected or highlighted styles
        isSelected
          ? "ring-2 ring-ai-primary border-ai-primary bg-white dark:bg-surface shadow-xl shadow-ai-primary/10 -translate-y-2 scale-[1.02]"
          : isHighlighted
            ? "border-2 border-ai-primary/40 bg-white dark:bg-surface shadow-lg hover:shadow-xl hover:-translate-y-1.5 hover:border-ai-primary"
            : "border border-border bg-surface hover:shadow-lg hover:border-border-hover hover:-translate-y-1",
      ].join(" ")}
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* ── "Most Popular" badge — positioned above the card ── */}
      {plan.badge && (
        <div className="absolute -top-4 inset-x-0 flex justify-center pointer-events-none z-10">
          <span
            className={[
              "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold",
              "bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 text-white",
              "shadow-lg shadow-ai-primary/25",
              // Subtle pulse animation to draw attention
              "animate-[ai-gradient-shift_3s_ease_infinite]",
            ].join(" ")}
            style={{ backgroundSize: "200% 200%" }}
          >
            <SparkleIcon className="w-3.5 h-3.5" />
            {plan.badge}
          </span>
        </div>
      )}

      {/* ── Selected checkmark indicator ── */}
      <div
        className={[
          "absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center",
          "transition-all duration-300",
          isSelected
            ? "bg-ai-primary scale-100 opacity-100"
            : "bg-ai-cloud dark:bg-surface-tertiary scale-90 opacity-60 group-hover:opacity-100",
        ].join(" ")}
      >
        {isSelected ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="white" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
          </svg>
        ) : (
          <span className="w-2 h-2 rounded-full bg-ai-silver dark:bg-ai-slate transition-colors group-hover:bg-ai-primary/40" />
        )}
      </div>

      {/* ── Plan name ── */}
      <h3 className={[
        "text-lg font-bold transition-colors duration-200",
        isSelected ? "text-ai-primary" : "text-ai-ink dark:text-white",
      ].join(" ")}>
        {plan.name}
      </h3>
      <p className="text-sm text-ai-graphite dark:text-ai-slate mt-1 pr-6">{plan.description}</p>

      {/* ── Price with animated underline ── */}
      <div className="mt-5 mb-6">
        <span className={[
          "text-4xl font-black transition-colors duration-200",
          isSelected ? "text-ai-primary" : "text-ai-ink dark:text-white",
        ].join(" ")}>
          {plan.price}
        </span>
        <span className="text-sm text-ai-slate ml-1">{plan.period}</span>
        {/* Animated underline accent */}
        <div className={[
          "mt-2 h-0.5 rounded-full transition-all duration-500 ease-out",
          isSelected
            ? "w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500"
            : "w-0 bg-ai-primary group-hover:w-12",
        ].join(" ")} />
      </div>

      {/* ── CTA Button ── */}
      <Link href="/register" onClick={(e) => e.stopPropagation()}>
        <Button
          variant={isSelected ? "gradient" : plan.ctaVariant}
          fullWidth
          size="lg"
          className={[
            "transition-all duration-300",
            isSelected ? "shadow-md shadow-ai-primary/20" : "",
          ].join(" ")}
        >
          {plan.cta}
        </Button>
      </Link>

      {/* ── Features list ── */}
      <ul className="mt-6 space-y-3">
        {plan.features.map((feat, fi) => (
          <li
            key={feat}
            className="flex items-start gap-2.5 animate-[ai-fade-in_400ms_ease-out_both]"
            style={{ animationDelay: `${(index * 120) + (fi * 60) + 200}ms` }}
          >
            <CheckIcon className={[
              "w-4 h-4 shrink-0 mt-0.5 transition-colors duration-200",
              isSelected ? "text-ai-primary" : "text-ai-slate group-hover:text-ai-primary",
            ].join(" ")} />
            <span className="text-sm text-ai-graphite dark:text-ai-slate">{feat}</span>
          </li>
        ))}
      </ul>

      {/* ── Subtle glow on selected ── */}
      {isSelected && (
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-ai-primary/5 to-transparent pointer-events-none" />
      )}
    </div>
  );
}

/* ── Main component ── */
export function PricingPreview() {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>("pro");

  return (
    <section id="pricing" className="py-20 sm:py-28 bg-surface-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <p className="text-sm font-semibold text-ai-primary uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-ai-ink dark:text-white tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-ai-graphite dark:text-ai-slate leading-relaxed">
            Start for free. Upgrade when you need more power. No hidden fees.
          </p>
        </div>

        {/* Plans grid — extra top padding for the badge overflow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto pt-4">
          {PLANS.map((plan, i) => (
            <PricingCard
              key={plan.key}
              plan={plan}
              isSelected={selectedPlan === plan.key}
              onSelect={() => setSelectedPlan(plan.key)}
              index={i}
            />
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-ai-slate mt-10">
          All plans include SSL encryption, 99.9% uptime SLA, and no credit card required for Free.
        </p>
      </div>
    </section>
  );
}

export default PricingPreview;
