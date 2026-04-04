"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Badge, Card } from "@/components/ui";
import { PLANS } from "@/lib/utils/plans";
import { apiGetMe } from "@/lib/api/auth";
import { useCheckout } from "@/hooks/use-checkout";
import type { User } from "@/types/auth.types";

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
  );
}

export function PricingPageContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const { checkout, isLoading: loadingPlan } = useCheckout({
    onError: (msg) => setCheckoutError(msg),
  });

  useEffect(() => {
    apiGetMe().then(setUser).catch(() => {/* not logged in */});
  }, []);

  async function handleSelectPlan(planKey: "PRO" | "BYOK") {
    if (!user) {
      router.push("/register");
      return;
    }
    setCheckoutError(null);
    await checkout(planKey);
  }

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-ai-ink dark:text-white tracking-tight">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-lg text-ai-graphite dark:text-ai-slate max-w-2xl mx-auto">
            Choose the plan that fits your workflow. Upgrade or downgrade anytime.
          </p>
        </div>

        {checkoutError && (
          <div className="mb-8 p-4 rounded-lg bg-red-50 dark:bg-red-500/10 text-center">
            <p className="text-sm text-red-700 dark:text-red-300">{checkoutError}</p>
          </div>
        )}

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {PLANS.map((plan) => {
            const isCurrent = user?.plan === plan.key;
            const isHighlighted = plan.highlight;

            return (
              <Card
                key={plan.key}
                variant={isHighlighted ? "elevated" : "outlined"}
                padding="lg"
                className={[
                  "relative flex flex-col",
                  isHighlighted
                    ? "ring-2 ring-ai-primary shadow-lg scale-[1.02]"
                    : "",
                ].join(" ")}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary" size="sm">{plan.badge}</Badge>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-ai-ink dark:text-white">{plan.name}</h3>
                  <p className="mt-1 text-sm text-ai-graphite dark:text-ai-slate">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-ai-ink dark:text-white">{plan.price}</span>
                  <span className="text-sm text-ai-graphite dark:text-ai-slate ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-2 text-sm text-ai-charcoal dark:text-ai-cloud">
                      <CheckIcon />
                      {feature.text}
                    </li>
                  ))}
                </ul>

                {plan.key === "FREE" ? (
                  <Button
                    variant={isCurrent ? "outline" : "secondary"}
                    size="lg"
                    fullWidth
                    disabled={isCurrent}
                  >
                    {isCurrent ? "Current Plan" : user ? "Current Plan" : "Get Started Free"}
                  </Button>
                ) : (
                  <Button
                    variant={isHighlighted ? "gradient" : "primary"}
                    size="lg"
                    fullWidth
                    disabled={isCurrent}
                    isLoading={loadingPlan === plan.key}
                    onClick={() => handleSelectPlan(plan.key as "PRO" | "BYOK")}
                  >
                    {isCurrent ? "Current Plan" : `Get ${plan.name}`}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
