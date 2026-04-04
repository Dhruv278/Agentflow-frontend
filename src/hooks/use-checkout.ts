"use client";

import { useState, useCallback, useRef } from "react";
import { apiCreateCheckout, apiVerifyRazorpayPayment } from "@/lib/api/billing";
import { useRazorpay } from "./use-razorpay";

interface UseCheckoutOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useCheckout(options: UseCheckoutOptions = {}) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { openCheckout } = useRazorpay();
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const checkout = useCallback(
    async (plan: "PRO" | "BYOK") => {
      setIsLoading(plan);

      try {
        const result = await apiCreateCheckout(plan);

        if (result.type === "redirect") {
          window.location.href = result.url;
          return;
        }

        // Razorpay modal flow
        const rzpInstance = openCheckout({
          key: result.keyId,
          subscription_id: result.subscriptionId,
          name: "AgentFlow",
          description: `${plan} Plan Subscription`,
          prefill: result.prefill,
          theme: { color: "#6366f1" },
          handler: async (response: RazorpayPaymentResponse) => {
            try {
              await apiVerifyRazorpayPayment(
                response.razorpay_payment_id,
                response.razorpay_subscription_id,
                response.razorpay_signature,
              );
              window.location.href = "/dashboard?upgraded=true";
            } catch {
              setIsLoading(null);
              optionsRef.current.onError?.("Payment verification failed. Please contact support.");
            }
          },
          modal: {
            ondismiss: () => {
              setIsLoading(null);
            },
            confirm_close: true,
          },
        });

        if (!rzpInstance) {
          setIsLoading(null);
          optionsRef.current.onError?.("Payment service unavailable. Please try again.");
        }
      } catch {
        setIsLoading(null);
        optionsRef.current.onError?.("Failed to initiate checkout. Please try again.");
      }
    },
    [openCheckout],
  );

  return { checkout, isLoading };
}
