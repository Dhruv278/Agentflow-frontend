"use client";

import React from "react";
import Link from "next/link";
import { Button, Input, PasswordInput } from "@/components/ui";
import {
  AuthLayoutShell,
  FormMessageBanner,
  OAuthDivider,
  SocialLoginButtons,
} from "@/components/features/auth";
import { useFormState } from "@/hooks/use-form-state";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateName,
} from "@/lib/utils/validation";

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
  const form = useFormState({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      const errors: Partial<Record<keyof typeof values, string>> = {};
      const nameResult = validateName(values.name);
      if (!nameResult.valid) errors.name = nameResult.error;
      const emailResult = validateEmail(values.email);
      if (!emailResult.valid) errors.email = emailResult.error;
      const passResult = validatePassword(values.password);
      if (!passResult.valid) errors.password = passResult.error;
      const confirmResult = validateConfirmPassword(values.password, values.confirmPassword);
      if (!confirmResult.valid) errors.confirmPassword = confirmResult.error;
      return errors;
    },
    onSubmit: async (values) => {
      // TODO: Replace with actual API call — POST /auth/register
      // Payload: { name, email, password } (confirmPassword is client-side only)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Register:", {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      form.setMessage({ type: "success", text: "Account created! Redirecting to dashboard…" });
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
      {/* Form message */}
      {form.message && <FormMessageBanner type={form.message.type} text={form.message.text} />}

      {/* Social login */}
      <SocialLoginButtons />
      <OAuthDivider />

      {/* Register form */}
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

        <PasswordInput
          label="Password"
          placeholder="Create a strong password"
          autoComplete="new-password"
          inputSize="lg"
          showStrength
          value={form.values.password}
          onChange={(e) => form.setField("password", e.target.value)}
          onBlur={() => form.handleBlur("password")}
          error={form.touched.password ? form.errors.password : undefined}
          disabled={form.isLoading}
        />

        <PasswordInput
          label="Confirm password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          inputSize="lg"
          value={form.values.confirmPassword}
          onChange={(e) => form.setField("confirmPassword", e.target.value)}
          onBlur={() => form.handleBlur("confirmPassword")}
          error={form.touched.confirmPassword ? form.errors.confirmPassword : undefined}
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
          Create Account
        </Button>
      </form>

      {/* Terms */}
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
