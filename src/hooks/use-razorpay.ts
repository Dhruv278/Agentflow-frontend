"use client";

import { useState, useEffect, useCallback } from "react";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    const existing = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => setIsLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      /* Razorpay script failed to load — checkout will fall back to error state */
    };
    document.head.appendChild(script);
  }, []);

  const openCheckout = useCallback(
    (options: RazorpayCheckoutOptions): RazorpayInstance | null => {
      if (!window.Razorpay) return null;
      const rzp = new window.Razorpay(options);
      rzp.open();
      return rzp;
    },
    [],
  );

  return { isLoaded, openCheckout };
}
