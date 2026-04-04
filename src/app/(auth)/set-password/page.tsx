"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button, PasswordInput } from "@/components/ui";
import { AuthLayoutShell, FormMessageBanner } from "@/components/features/auth";
import { useFormState } from "@/hooks/use-form-state";
import { validatePassword, validateConfirmPassword } from "@/lib/utils/validation";
import { apiSetPassword } from "@/lib/api/auth";
import type { AxiosError } from "axios";

function ShieldCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-ai-success">
      <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
  );
}

export default function SetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useFormState({
    initialValues: { password: "", confirmPassword: "" },
    validate: (values) => {
      const errors: Partial<Record<keyof typeof values, string>> = {};
      const passResult = validatePassword(values.password);
      if (!passResult.valid) errors.password = passResult.error;
      const confirmResult = validateConfirmPassword(values.password, values.confirmPassword);
      if (!confirmResult.valid) errors.confirmPassword = confirmResult.error;
      return errors;
    },
    onSubmit: async (values) => {
      if (!token) return;
      try {
        await apiSetPassword(token, values.password);
        form.setMessage({ type: "success", text: "Account verified and password set!" });
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        const message = axiosErr.response?.data?.message ?? "Failed to set password. The link may have expired.";
        throw new Error(Array.isArray(message) ? message[0] : message);
      }
    },
  });

  const isSuccess = form.message?.type === "success";

  if (!token) {
    return (
      <AuthLayoutShell
        title="Invalid link"
        subtitle="This verification link is missing or malformed"
      >
        <div className="text-center space-y-6 mt-4">
          <p className="text-sm text-ai-graphite dark:text-ai-slate">
            The link you followed appears to be invalid. Please register again to receive a new verification email.
          </p>
          <Link href="/register">
            <Button variant="gradient" size="xl" fullWidth>
              Go to Registration
            </Button>
          </Link>
        </div>
      </AuthLayoutShell>
    );
  }

  return (
    <AuthLayoutShell
      title="Set your password"
      subtitle="Create a strong password to activate your account"
      footer={
        !isSuccess ? (
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-ai-primary hover:text-ai-primary-hover transition-colors"
            >
              Sign in
            </Link>
          </p>
        ) : undefined
      }
    >
      {form.message && <FormMessageBanner type={form.message.type} text={form.message.text} />}

      {isSuccess ? (
        <div className="mt-6 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-ai-success-light dark:bg-emerald-500/10 flex items-center justify-center">
            <ShieldCheckIcon />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-ai-ink dark:text-white">
              Account activated!
            </h3>
            <p className="mt-2 text-sm text-ai-graphite dark:text-ai-slate max-w-xs mx-auto">
              Your email has been verified and your password is set. You can now sign in.
            </p>
          </div>
          <Link href="/login">
            <Button variant="gradient" size="xl" fullWidth>
              Sign In to Your Account
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={form.handleSubmit} noValidate className="space-y-4 mt-2">
          <div className="p-3 rounded-xl bg-surface-secondary border border-border">
            <p className="text-xs font-medium text-ai-charcoal dark:text-ai-cloud mb-2">
              Password requirements:
            </p>
            <ul className="space-y-1">
              {[
                { rule: "At least 8 characters", met: form.values.password.length >= 8 },
                { rule: "One uppercase letter", met: /[A-Z]/.test(form.values.password) },
                { rule: "One lowercase letter", met: /[a-z]/.test(form.values.password) },
                { rule: "One number", met: /\d/.test(form.values.password) },
              ].map((req) => (
                <li key={req.rule} className="flex items-center gap-2 text-xs">
                  {req.met ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-ai-success">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-ai-silver flex items-center justify-center">
                      <span className="w-1 h-1 rounded-full bg-ai-silver" />
                    </span>
                  )}
                  <span className={req.met ? "text-ai-charcoal dark:text-ai-cloud" : "text-ai-slate"}>
                    {req.rule}
                  </span>
                </li>
              ))}
            </ul>
          </div>

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
            Set Password & Activate
          </Button>
        </form>
      )}
    </AuthLayoutShell>
  );
}
