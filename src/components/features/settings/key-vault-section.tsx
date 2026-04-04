"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  PasswordInput,
  Badge,
  ConfirmDialog,
} from "@/components/ui";
import { useFormState } from "@/hooks/use-form-state";
import { FormMessageBanner } from "@/components/features/auth";
import type { AxiosError } from "axios";

export interface KeyVaultSectionProps {
  userPlan: "FREE" | "PRO" | "BYOK";
  hasKey: boolean;
  addedAt: string | null;
  lastUsedAt: string | null;
  isStatusLoading: boolean;
  statusError: string | null;
  onSaveKey: (key: string) => Promise<void>;
  onDeleteKey: () => Promise<void>;
  onRetry: () => void;
}

function KeyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M8 7a5 5 0 1 1 3.61 4.804l-1.903 1.903A1 1 0 0 1 9 14H8v1a1 1 0 0 1-1 1H6v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 .293-.707L8.196 8.39A5.002 5.002 0 0 1 8 7Zm5-3a.75.75 0 0 0 0 1.5A1.5 1.5 0 0 1 14.5 7 .75.75 0 0 0 16 7a3 3 0 0 0-3-3Z" clipRule="evenodd" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" />
    </svg>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Never";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function KeyVaultSection({
  userPlan,
  hasKey,
  addedAt,
  lastUsedAt,
  isStatusLoading,
  statusError,
  onSaveKey,
  onDeleteKey,
  onRetry,
}: KeyVaultSectionProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useFormState({
    initialValues: { key: "" },
    validate: (values) => {
      const errors: Partial<Record<keyof typeof values, string>> = {};
      if (!values.key.trim()) errors.key = "API key is required";
      else if (values.key.trim().length < 10) errors.key = "API key is too short";
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await onSaveKey(values.key.trim());
        form.setMessage({ type: "success", text: "OpenRouter key saved successfully!" });
        form.reset();
      } catch (err) {
        const axiosErr = err as AxiosError<{ message: string }>;
        const message = axiosErr.response?.data?.message ?? "Failed to save key";
        throw new Error(Array.isArray(message) ? message[0] : message);
      }
    },
  });

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await onDeleteKey();
      setShowDeleteDialog(false);
    } catch {
      // Error handled by parent
    } finally {
      setIsDeleting(false);
    }
  }

  // Loading state
  if (isStatusLoading) {
    return (
      <Card variant="outlined" padding="lg">
        <div className="animate-pulse space-y-4">
          <div className="h-5 w-48 bg-surface-tertiary rounded" />
          <div className="h-4 w-72 bg-surface-tertiary rounded" />
          <div className="h-10 w-full bg-surface-tertiary rounded-lg" />
        </div>
      </Card>
    );
  }

  // Error state
  if (statusError) {
    return (
      <Card variant="outlined" padding="lg">
        <div className="text-center py-4">
          <p className="text-sm text-ai-error mb-3">{statusError}</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  // FREE plan — upgrade CTA
  if (userPlan === "FREE") {
    return (
      <Card variant="outlined" padding="lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ai-primary-soft flex items-center justify-center text-ai-primary">
              <LockIcon />
            </div>
            <div>
              <CardTitle>OpenRouter API Key</CardTitle>
              <CardDescription>Upgrade your plan to use your own API key</CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="mt-4 p-4 rounded-xl bg-surface-secondary border border-border">
          <p className="text-sm text-ai-graphite dark:text-ai-slate mb-3">
            Free plan users use platform credits. Upgrade to Pro or BYOK to bring your own OpenRouter key.
          </p>
          <Link href="/billing">
            <Button variant="gradient" size="md">
              Upgrade Plan
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  // PRO/BYOK — has key stored
  if (hasKey) {
    return (
      <>
        <Card variant="outlined" padding="lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <KeyIcon />
                </div>
                <div>
                  <CardTitle>OpenRouter API Key</CardTitle>
                  <CardDescription>Your key is securely stored and encrypted</CardDescription>
                </div>
              </div>
              <Badge variant="success" dot>Active</Badge>
            </div>
          </CardHeader>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
              <span className="text-sm text-ai-graphite dark:text-ai-slate">Added</span>
              <span className="text-sm font-medium text-ai-ink dark:text-white">{formatDate(addedAt)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-secondary">
              <span className="text-sm text-ai-graphite dark:text-ai-slate">Last used</span>
              <span className="text-sm font-medium text-ai-ink dark:text-white">{formatDate(lastUsedAt)}</span>
            </div>
            {userPlan === "BYOK" && (
              <p className="text-xs text-ai-warning mt-2">
                Removing your key will prevent agent runs on your BYOK plan.
              </p>
            )}
            <div className="pt-2">
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteDialog(true)}
              >
                Remove Key
              </Button>
            </div>
          </div>
        </Card>

        <ConfirmDialog
          open={showDeleteDialog}
          title="Remove OpenRouter Key"
          description="This will permanently delete your stored API key. You can add a new key at any time."
          confirmLabel="Remove Key"
          variant="danger"
          isLoading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </>
    );
  }

  // PRO/BYOK — no key stored
  return (
    <Card variant="outlined" padding="lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ai-primary-soft flex items-center justify-center text-ai-primary">
            <KeyIcon />
          </div>
          <div>
            <CardTitle>OpenRouter API Key</CardTitle>
            <CardDescription>Add your key to use your own API credits</CardDescription>
          </div>
        </div>
      </CardHeader>

      {form.message && (
        <div className="mt-4">
          <FormMessageBanner type={form.message.type} text={form.message.text} />
        </div>
      )}

      <form onSubmit={form.handleSubmit} noValidate className="mt-4 space-y-4">
        <PasswordInput
          label="API Key"
          placeholder="sk-or-v1-..."
          inputSize="lg"
          value={form.values.key}
          onChange={(e) => form.setField("key", e.target.value)}
          onBlur={() => form.handleBlur("key")}
          error={form.touched.key ? form.errors.key : undefined}
          disabled={form.isLoading}
        />
        {userPlan === "BYOK" && (
          <p className="text-xs text-ai-graphite dark:text-ai-slate">
            Your BYOK plan requires an API key to run agents.
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={form.isLoading}
        >
          Save Key
        </Button>
      </form>
    </Card>
  );
}
