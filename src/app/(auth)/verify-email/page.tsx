"use client";

import React, { Suspense, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import {
  AuthLayoutShell,
  FormMessageBanner,
} from "@/components/features/auth";
import { apiResendVerification } from "@/lib/api/auth";

function MailOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12 text-ai-primary">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleResend = useCallback(async () => {
    if (!email || resending) return;
    setResending(true);
    setMessage(null);
    try {
      const msg = await apiResendVerification(email);
      setMessage({ type: "success", text: msg });
    } catch {
      setMessage({ type: "error", text: "Failed to resend. Please try again." });
    } finally {
      setResending(false);
    }
  }, [email, resending]);

  return (
    <AuthLayoutShell
      title="Check your email"
      subtitle="We sent a verification link to your inbox"
      footer={
        <p>
          Wrong email?{" "}
          <Link
            href="/register"
            className="font-semibold text-ai-primary hover:text-ai-primary-hover transition-colors"
          >
            Try a different email
          </Link>
        </p>
      }
    >
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-ai-primary/10 flex items-center justify-center">
          <MailOpenIcon />
        </div>

        {email && (
          <p className="text-sm text-ai-graphite dark:text-ai-slate">
            We sent an email to{" "}
            <span className="font-semibold text-ai-ink dark:text-white">{email}</span>.
            Click the link in the email to set your password and activate your account.
          </p>
        )}

        {!email && (
          <p className="text-sm text-ai-graphite dark:text-ai-slate">
            Check your email for a verification link to set your password and activate your account.
          </p>
        )}

        {message && <FormMessageBanner type={message.type} text={message.text} />}

        <div className="w-full space-y-3">
          {email && (
            <Button
              variant="outline"
              size="lg"
              fullWidth
              isLoading={resending}
              onClick={handleResend}
            >
              Resend verification email
            </Button>
          )}

          <Button
            variant="ghost"
            size="lg"
            fullWidth
            onClick={() => {
              window.open("https://mail.google.com", "_blank");
            }}
          >
            Open email app
          </Button>
        </div>

        <p className="text-xs text-ai-slate">
          The link expires in 24 hours. Check your spam folder if you don&apos;t see it.
        </p>
      </div>
    </AuthLayoutShell>
  );
}
