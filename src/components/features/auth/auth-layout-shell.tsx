"use client";

import React from "react";
import Link from "next/link";

/* ── Logo ── */
function LogoIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className ?? "w-8 h-8"}>
      <defs>
        <linearGradient id="auth-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <path
        d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z"
        fill="url(#auth-logo-grad)"
      />
    </svg>
  );
}

/* ── Form message banner (success / error) ── */
export interface FormMessageBannerProps {
  type: "success" | "error";
  text: string;
}

export function FormMessageBanner({ type, text }: FormMessageBannerProps) {
  return (
    <div
      role="alert"
      className={[
        "flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm animate-[ai-fade-in_200ms_ease-out]",
        type === "error"
          ? "bg-ai-error-light text-red-700 dark:bg-red-500/10 dark:text-red-300"
          : "bg-ai-success-light text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
      ].join(" ")}
    >
      {type === "error" ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 mt-px">
          <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0 mt-px">
          <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
        </svg>
      )}
      <span>{text}</span>
    </div>
  );
}

/* ── Social / OAuth divider ── */
export function OAuthDivider() {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="bg-surface px-3 text-ai-slate">or continue with</span>
      </div>
    </div>
  );
}

/* ── Social login buttons ── */
export function SocialLoginButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        className="ai-focus-ring flex items-center justify-center gap-2 h-10 rounded-lg border border-border bg-surface text-sm font-medium text-ai-charcoal hover:bg-surface-secondary transition-colors dark:text-ai-cloud cursor-pointer"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62Z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
        </svg>
        Google
      </button>
      <button
        type="button"
        className="ai-focus-ring flex items-center justify-center gap-2 h-10 rounded-lg border border-border bg-surface text-sm font-medium text-ai-charcoal hover:bg-surface-secondary transition-colors dark:text-ai-cloud cursor-pointer"
      >
        <svg className="w-4 h-4 dark:invert" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
        </svg>
        GitHub
      </button>
    </div>
  );
}

/* ── Main auth layout shell ── */
export interface AuthLayoutShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthLayoutShell({ title, subtitle, children, footer }: AuthLayoutShellProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* ── Left panel — branding (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-700" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.15),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <LogoIcon className="w-5 h-5 [&_path]:fill-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">AgentFlow</span>
          </Link>

          {/* Testimonial / Value prop */}
          <div className="max-w-md">
            <blockquote className="text-xl xl:text-2xl font-medium text-white/95 leading-relaxed">
              &ldquo;AgentFlow transformed how we handle research and content creation. Our team of AI agents does in minutes what used to take hours.&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white">
                AK
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Alex Kim</p>
                <p className="text-sm text-white/60">CTO, TechForward</p>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex gap-8">
            {[
              { value: "2,400+", label: "Users" },
              { value: "50K+", label: "Agent Runs" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-lg font-bold text-white">{stat.value}</p>
                <p className="text-xs text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <LogoIcon className="w-7 h-7" />
              <span className="text-lg font-bold tracking-tight text-ai-ink dark:text-white">AgentFlow</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-ai-ink dark:text-white tracking-tight">
              {title}
            </h1>
            <p className="mt-2 text-sm text-ai-graphite dark:text-ai-slate">
              {subtitle}
            </p>
          </div>

          {/* Form content */}
          {children}

          {/* Footer (links) */}
          {footer && (
            <div className="mt-8 text-center text-sm text-ai-graphite dark:text-ai-slate">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthLayoutShell;
