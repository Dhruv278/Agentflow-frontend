"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, PasswordInput } from "@/components/ui";
import {
  AuthLayoutShell,
  FormMessageBanner,
} from "@/components/features/auth";
import { useFormState } from "@/hooks/use-form-state";
import { validateEmail } from "@/lib/utils/validation";
import { apiLogin } from "@/lib/api/auth";
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

/* ── Page ── */
export default function LoginPage() {
  const router = useRouter();

  const form = useFormState({
    initialValues: { email: "", password: "" },
    validate: (values) => {
      const errors: Partial<Record<keyof typeof values, string>> = {};
      const emailResult = validateEmail(values.email);
      if (!emailResult.valid) errors.email = emailResult.error;
      if (!values.password) errors.password = "Password is required";
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await apiLogin(values.email, values.password);
        form.setMessage({ type: "success", text: "Login successful! Redirecting…" });
        router.push("/dashboard");
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        const msg = axiosErr.response?.data?.message ?? "Login failed. Please try again.";
        const message = Array.isArray(msg) ? msg[0] : msg;

        if (typeof message === "string" && message.toLowerCase().includes("verify your email")) {
          form.setMessage({
            type: "error",
            text: "Your email is not verified yet. Please check your inbox for the verification link.",
          });
          return;
        }

        throw new Error(message);
      }
    },
  });

  const isUnverifiedError =
    form.message?.type === "error" &&
    form.message.text.includes("not verified");

  return (
    <AuthLayoutShell
      title="Welcome back"
      subtitle="Sign in to your AgentFlow account"
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-ai-primary hover:text-ai-primary-hover transition-colors"
          >
            Create one free
          </Link>
        </p>
      }
    >
      {form.message && <FormMessageBanner type={form.message.type} text={form.message.text} />}

      {isUnverifiedError && form.values.email && (
        <div className="mt-2 text-center">
          <Link
            href={`/verify-email?email=${encodeURIComponent(form.values.email)}`}
            className="text-sm font-medium text-ai-primary hover:text-ai-primary-hover transition-colors"
          >
            Resend verification email
          </Link>
        </div>
      )}

      <form onSubmit={form.handleSubmit} noValidate className="space-y-4 mt-4">
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

        <div>
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            inputSize="lg"
            value={form.values.password}
            onChange={(e) => form.setField("password", e.target.value)}
            onBlur={() => form.handleBlur("password")}
            error={form.touched.password ? form.errors.password : undefined}
            disabled={form.isLoading}
          />
          <div className="flex justify-end mt-1.5">
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-ai-primary hover:text-ai-primary-hover transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="gradient"
          size="xl"
          fullWidth
          isLoading={form.isLoading}
          className="mt-2"
        >
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-[11px] text-ai-slate leading-relaxed">
        By signing in, you agree to our{" "}
        <Link href="#" className="underline hover:text-ai-charcoal dark:hover:text-ai-cloud">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="underline hover:text-ai-charcoal dark:hover:text-ai-cloud">
          Privacy Policy
        </Link>
      </p>
    </AuthLayoutShell>
  );
}
