"use client";

import React from "react";
import Link from "next/link";
import { Button, Input } from "@/components/ui";
import { AuthLayoutShell, FormMessageBanner } from "@/components/features/auth";
import { useFormState } from "@/hooks/use-form-state";
import { validateEmail } from "@/lib/utils/validation";
import { apiForgotPassword } from "@/lib/api/auth";
import type { AxiosError } from "axios";

/* ── Icons ── */
function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
      <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
    </svg>
  );
}

/* ── Page ── */
export default function ForgotPasswordPage() {
  const form = useFormState({
    initialValues: { email: "" },
    validate: (values) => {
      const errors: Partial<Record<keyof typeof values, string>> = {};
      const emailResult = validateEmail(values.email);
      if (!emailResult.valid) errors.email = emailResult.error;
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const msg = await apiForgotPassword(values.email);
        form.setMessage({ type: "success", text: msg });
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        const message = axiosErr.response?.data?.message ?? "Something went wrong. Please try again.";
        throw new Error(Array.isArray(message) ? message[0] : message);
      }
    },
  });

  const isSuccess = form.message?.type === "success";

  return (
    <AuthLayoutShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-medium text-ai-primary hover:text-ai-primary-hover transition-colors"
        >
          <ArrowLeftIcon />
          Back to sign in
        </Link>
      }
    >
      {/* Form message */}
      {form.message && <FormMessageBanner type={form.message.type} text={form.message.text} />}

      {isSuccess ? (
        /* Success state — show email sent confirmation */
        <div className="mt-6 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-ai-success-light dark:bg-emerald-500/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-ai-success">
              <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
              <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ai-ink dark:text-white">Check your email</h3>
            <p className="mt-2 text-sm text-ai-graphite dark:text-ai-slate max-w-xs mx-auto">
              We&apos;ve sent a password reset link to <span className="font-medium text-ai-charcoal dark:text-ai-cloud">{form.values.email}</span>
            </p>
          </div>
          <div className="space-y-3">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                // Open email client
                window.open("mailto:", "_blank");
              }}
            >
              Open Email App
            </Button>
            <Button
              variant="ghost"
              size="lg"
              fullWidth
              onClick={() => form.reset()}
            >
              Try a different email
            </Button>
          </div>
        </div>
      ) : (
        /* Form state */
        <form onSubmit={form.handleSubmit} noValidate className="space-y-4 mt-2">
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            inputSize="lg"
            leftIcon={<MailIcon />}
            value={form.values.email}
            onChange={(e) => form.setField("email", e.target.value)}
            onBlur={() => form.handleBlur("email")}
            error={form.touched.email ? form.errors.email : undefined}
            disabled={form.isLoading}
          />

          <Button
            type="submit"
            variant="gradient"
            size="xl"
            fullWidth
            isLoading={form.isLoading}
          >
            Send Reset Link
          </Button>
        </form>
      )}
    </AuthLayoutShell>
  );
}
