"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import {
  AuthLayoutShell,
  FormMessageBanner,
} from "@/components/features/auth";
import { useFormState } from "@/hooks/use-form-state";
import { validateEmail, validateName } from "@/lib/utils/validation";
import { apiRegister } from "@/lib/api/auth";
import type { AxiosError } from "axios";

/* ── Icons ── */
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px]">
      <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
      <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
    </svg>
  );
}

/* ── Page ── */
export default function RegisterPage() {
  const router = useRouter();

  const form = useFormState({
    initialValues: {
      name: "",
      email: "",
    },
    validate: (values) => {
      const errors: Partial<Record<keyof typeof values, string>> = {};
      const nameResult = validateName(values.name);
      if (!nameResult.valid) errors.name = nameResult.error;
      const emailResult = validateEmail(values.email);
      if (!emailResult.valid) errors.email = emailResult.error;
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await apiRegister(values.name, values.email);
        router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        const message = axiosErr.response?.data?.message ?? "Registration failed. Please try again.";
        throw new Error(Array.isArray(message) ? message[0] : message);
      }
    },
  });

  return (
    <AuthLayoutShell
      title="Create your account"
      subtitle="Start building AI agent teams for free"
      footer={
        <p>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-ai-primary hover:text-ai-primary-hover transition-colors"
          >
            Sign in
          </Link>
        </p>
      }
    >
      {form.message && <FormMessageBanner type={form.message.type} text={form.message.text} />}

      <form onSubmit={form.handleSubmit} noValidate className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          inputSize="lg"
          leftIcon={<UserIcon />}
          value={form.values.name}
          onChange={(e) => form.setField("name", e.target.value)}
          onBlur={() => form.handleBlur("name")}
          error={form.touched.name ? form.errors.name : undefined}
          disabled={form.isLoading}
        />

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
          className="mt-2"
        >
          Continue with Email
        </Button>
      </form>

      <p className="mt-6 text-center text-[11px] text-ai-slate leading-relaxed">
        By creating an account, you agree to our{" "}
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
