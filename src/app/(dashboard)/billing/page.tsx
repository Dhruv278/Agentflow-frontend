"use client";

import React, { useState, useEffect, useCallback } from "react";
import { apiGetMe } from "@/lib/api/auth";
import {
  apiGetSubscription,
  apiCreatePortal,
  apiCancelSubscription,
} from "@/lib/api/billing";
import { useCheckout } from "@/hooks/use-checkout";
import { BillingPageContent } from "@/components/features/billing";
import type { User } from "@/types/auth.types";
import type { SubscriptionInfo } from "@/types/billing.types";

export default function BillingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { checkout, isLoading: checkoutLoadingPlan } = useCheckout({
    onError: (msg) => setError(msg),
  });

  const loadData = useCallback(() => {
    setIsLoading(true);
    setError(null);
    Promise.all([apiGetMe(), apiGetSubscription()])
      .then(([userData, subData]) => {
        setUser(userData);
        setSubscription(subData);
      })
      .catch(() => setError("Failed to load billing information"))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCheckout = useCallback(
    async (plan: "PRO" | "BYOK") => {
      await checkout(plan);
    },
    [checkout],
  );

  const handleManage = useCallback(async () => {
    const result = await apiCreatePortal();
    if (result.url) {
      window.location.href = result.url;
    }
  }, []);

  const handleCancel = useCallback(async () => {
    await apiCancelSubscription();
    loadData();
  }, [loadData]);

  return (
    <BillingPageContent
      user={user}
      subscription={subscription}
      isLoading={isLoading}
      error={error}
      onCheckout={handleCheckout}
      onManage={handleManage}
      onCancel={handleCancel}
      onRetry={loadData}
      checkoutLoadingPlan={checkoutLoadingPlan}
    />
  );
}
