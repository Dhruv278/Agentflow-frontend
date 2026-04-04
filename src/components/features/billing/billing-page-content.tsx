"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button, Badge, Card, CardTitle, CardDescription } from "@/components/ui";
import { PLANS } from "@/lib/utils/plans";
import type { User } from "@/types/auth.types";
import type { SubscriptionInfo } from "@/types/billing.types";

export interface BillingPageContentProps {
  user: User | null;
  subscription: SubscriptionInfo | null;
  isLoading: boolean;
  error: string | null;
  onCheckout: (plan: "PRO" | "BYOK") => Promise<void>;
  onManage: () => Promise<void>;
  onCancel: () => Promise<void>;
  onRetry: () => void;
  checkoutLoadingPlan: string | null;
}

const STATUS_BADGE: Record<string, { variant: "success" | "warning" | "error" | "default"; label: string }> = {
  ACTIVE: { variant: "success", label: "Active" },
  TRIALING: { variant: "default", label: "Trial" },
  PAST_DUE: { variant: "warning", label: "Past Due" },
  CANCELED: { variant: "error", label: "Canceled" },
};

const PLAN_BADGE: Record<string, { variant: "default" | "primary" | "success"; label: string }> = {
  FREE: { variant: "default", label: "Free" },
  PRO: { variant: "primary", label: "Pro" },
  BYOK: { variant: "success", label: "BYOK" },
};

const PLAN_CARD_ACCENT: Record<string, string> = {
  FREE: "border-l-ai-slate dark:border-l-ai-slate",
  PRO: "border-l-ai-primary",
  BYOK: "border-l-emerald-500 dark:border-l-emerald-400",
};

function BillingHeaderIcon() {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-ai-primary/15 to-indigo-500/10 text-ai-primary dark:from-ai-primary/25 dark:to-indigo-500/20 dark:text-indigo-300"
      aria-hidden
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="h-5 w-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 21Z" />
      </svg>
    </span>
  );
}

function FeatureCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-emerald-500">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function BillingPageContent({
  user,
  subscription,
  isLoading,
  error,
  onCheckout,
  onManage,
  onCancel,
  onRetry,
  checkoutLoadingPlan,
}: BillingPageContentProps) {
  const [manageLoading, setManageLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  async function handleManage() {
    setManageLoading(true);
    try {
      await onManage();
    } catch {
      setManageLoading(false);
    }
  }

  async function handleCancel() {
    setCancelLoading(true);
    try {
      await onCancel();
      setShowCancelConfirm(false);
    } catch {
      /* error handled by parent */
    } finally {
      setCancelLoading(false);
    }
  }

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse px-4 py-8 sm:px-6">
        <div className="mb-8 flex gap-4">
          <div className="h-11 w-11 shrink-0 rounded-xl bg-surface-tertiary" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-7 w-32 rounded-lg bg-surface-tertiary" />
            <div className="h-4 w-72 max-w-full rounded bg-surface-tertiary" />
          </div>
        </div>
        <div className="h-52 rounded-2xl border border-border bg-surface-tertiary/80" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex gap-4">
          <BillingHeaderIcon />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-ai-ink dark:text-white">Billing</h1>
            <p className="mt-1 text-sm text-ai-graphite dark:text-ai-slate">Subscription & payments</p>
          </div>
        </div>
        <div className="py-12 text-center">
          <p className="mb-3 text-sm text-ai-error">{error}</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const planKey = user?.plan ?? "FREE";
  const planConfig = PLAN_BADGE[planKey] ?? PLAN_BADGE["FREE"];
  const planAccent = PLAN_CARD_ACCENT[planKey] ?? PLAN_CARD_ACCENT["FREE"];
  const hasSubscription = subscription && subscription.status !== "CANCELED";
  const isRazorpay = subscription?.provider === "RAZORPAY";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-8 flex gap-4 sm:items-center">
        <BillingHeaderIcon />
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-ai-ink dark:text-white">Billing</h1>
          <p className="mt-1 text-sm text-ai-graphite dark:text-ai-slate">
            Manage your subscription and payment details
          </p>
        </div>
      </header>

      {/* Current plan card — badge aligned with title row only */}
      <Card
        variant="outlined"
        padding="lg"
        className={[
          "relative mb-8 overflow-hidden border-l-4 bg-surface-secondary/30 dark:bg-surface-secondary/20",
          planAccent,
        ].join(" ")}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-ai-primary/6 blur-2xl dark:bg-indigo-500/10"
          aria-hidden
        />
        <div className="relative">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <CardTitle className="text-xl">Current plan</CardTitle>
                <Badge variant={planConfig.variant} size="md" dot className="shrink-0">
                  {planConfig.label}
                </Badge>
              </div>
              <CardDescription className="mt-2 max-w-xl">
                {hasSubscription
                  ? `You are subscribed to ${planConfig.label}. Details below.`
                  : "You are on the free tier — upgrade anytime for more runs and models."}
              </CardDescription>
            </div>
          </div>

        {hasSubscription && subscription && (
          <dl className="mt-6 grid gap-3 sm:grid-cols-1">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-surface px-4 py-3">
              <dt className="text-sm text-ai-graphite dark:text-ai-slate">Status</dt>
              <dd className="m-0">
                <Badge variant={STATUS_BADGE[subscription.status]?.variant ?? "default"} size="sm">
                  {STATUS_BADGE[subscription.status]?.label ?? subscription.status}
                </Badge>
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-surface px-4 py-3">
              <dt className="text-sm text-ai-graphite dark:text-ai-slate">Payment via</dt>
              <dd className="m-0 text-sm font-medium text-ai-ink dark:text-white">
                {subscription.provider === "RAZORPAY" ? "Razorpay" : "Stripe"}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-surface px-4 py-3">
              <dt className="text-sm text-ai-graphite dark:text-ai-slate">Next billing date</dt>
              <dd className="m-0 text-sm font-medium tabular-nums text-ai-ink dark:text-white">
                {formatDate(subscription.currentPeriodEnd)}
              </dd>
            </div>
            {subscription.cancelAtPeriodEnd && (
              <div className="rounded-xl border border-amber-200/80 bg-ai-warning-light px-4 py-3 dark:border-amber-500/30 dark:bg-yellow-500/10">
                <p className="text-sm text-yellow-900 dark:text-yellow-200">
                  Your subscription will end after the current billing period. You will keep access until then.
                </p>
              </div>
            )}
          </dl>
        )}

        {hasSubscription && (
          <div className="mt-6 flex items-center gap-3">
            {isRazorpay ? (
              /* Razorpay: inline management since no portal exists */
              <>
                {!subscription.cancelAtPeriodEnd && !showCancelConfirm && (
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setShowCancelConfirm(true)}
                  >
                    Cancel Subscription
                  </Button>
                )}
                {showCancelConfirm && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-ai-graphite dark:text-ai-slate">
                      Are you sure?
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      isLoading={cancelLoading}
                      onClick={handleCancel}
                    >
                      Yes, Cancel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCancelConfirm(false)}
                    >
                      No, Keep
                    </Button>
                  </div>
                )}
              </>
            ) : (
              /* Stripe: open customer portal */
              <Button
                variant="outline"
                size="md"
                isLoading={manageLoading}
                onClick={handleManage}
              >
                Manage Subscription
              </Button>
            )}
          </div>
        )}
        </div>
      </Card>

      {/* Upgrade section (show when FREE or no active subscription) */}
      {!hasSubscription && (
        <section aria-labelledby="billing-upgrade-heading">
          <h2
            id="billing-upgrade-heading"
            className="mb-2 text-lg font-semibold tracking-tight text-ai-ink dark:text-white"
          >
            Upgrade your plan
          </h2>
          <p className="mb-6 text-sm text-ai-graphite dark:text-ai-slate">
            Unlock more runs, models, and teams. Prices in INR; secure checkout via Razorpay or Stripe.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {PLANS.filter((p) => p.key !== "FREE").map((plan) => {
              const isHighlight = Boolean(plan.highlight);
              return (
                <Card
                  key={plan.key}
                  variant={isHighlight ? "elevated" : "outlined"}
                  padding="lg"
                  hoverable
                  className={[
                    "relative flex flex-col",
                    isHighlight ? "ring-2 ring-ai-primary/40 shadow-md sm:scale-[1.02]" : "",
                  ].join(" ")}
                >
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0">
                      <Badge variant="primary" size="sm">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  <div className="mb-4 flex items-baseline justify-between gap-3 pt-1">
                    <h3 className="text-lg font-semibold text-ai-ink dark:text-white">{plan.name}</h3>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-ai-graphite dark:text-ai-slate">
                    {plan.description}
                  </p>
                  <p className="mb-4 text-3xl font-bold tracking-tight text-ai-ink dark:text-white">
                    {plan.price}
                    <span className="text-sm font-normal text-ai-graphite dark:text-ai-slate">{plan.period}</span>
                  </p>
                  <ul className="mb-6 flex flex-col gap-2 text-sm text-ai-graphite dark:text-ai-slate">
                    {plan.features.slice(0, 4).map((f) => (
                      <li key={f.text} className="flex gap-2">
                        <FeatureCheckIcon />
                        <span>{f.text}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Button
                      variant={isHighlight ? "gradient" : "primary"}
                      size="md"
                      fullWidth
                      isLoading={checkoutLoadingPlan === plan.key}
                      onClick={() => onCheckout(plan.key as "PRO" | "BYOK")}
                    >
                      Get {plan.name}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-ai-slate">
            <Link
              href="/pricing"
              className="font-medium underline decoration-ai-primary/40 underline-offset-2 hover:text-ai-charcoal dark:hover:text-ai-cloud"
            >
              Compare all plan features →
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}
