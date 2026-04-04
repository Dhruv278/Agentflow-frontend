"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui";
import { KeyVaultSection } from "@/components/features/settings";
import { apiGetMe } from "@/lib/api/auth";
import { apiGetOrKeyStatus, apiSaveOrKey, apiDeleteOrKey } from "@/lib/api/settings";
import type { User } from "@/types/auth.types";
import type { OrKeyStatus } from "@/types/settings.types";

const PLAN_BADGE: Record<string, { variant: "default" | "primary" | "success"; label: string }> = {
  FREE: { variant: "default", label: "Free" },
  PRO: { variant: "primary", label: "Pro" },
  BYOK: { variant: "success", label: "BYOK" },
};

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [keyStatus, setKeyStatus] = useState<OrKeyStatus | null>(null);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([apiGetMe(), apiGetOrKeyStatus()])
      .then(([userData, statusData]) => {
        setUser(userData);
        setKeyStatus(statusData);
      })
      .catch(() => {
        setStatusError("Failed to load settings");
      })
      .finally(() => {
        setIsStatusLoading(false);
      });
  }, []);

  const handleSaveKey = useCallback(async (key: string) => {
    await apiSaveOrKey(key);
    const status = await apiGetOrKeyStatus();
    setKeyStatus(status);
  }, []);

  const handleDeleteKey = useCallback(async () => {
    await apiDeleteOrKey();
    const status = await apiGetOrKeyStatus();
    setKeyStatus(status);
  }, []);

  const handleRetry = useCallback(() => {
    setIsStatusLoading(true);
    setStatusError(null);
    Promise.all([apiGetMe(), apiGetOrKeyStatus()])
      .then(([userData, statusData]) => {
        setUser(userData);
        setKeyStatus(statusData);
      })
      .catch(() => setStatusError("Failed to load settings"))
      .finally(() => setIsStatusLoading(false));
  }, []);

  if (!user && isStatusLoading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 animate-pulse">
        <div className="h-8 w-32 bg-surface-tertiary rounded-lg mb-2" />
        <div className="h-4 w-64 bg-surface-tertiary rounded mb-8" />
        <div className="h-5 w-40 bg-surface-tertiary rounded mb-6" />
        <div className="h-48 bg-surface-tertiary rounded-2xl" />
      </div>
    );
  }

  const planConfig = PLAN_BADGE[user?.plan ?? "FREE"] ?? PLAN_BADGE["FREE"];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ai-ink dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-ai-graphite dark:text-ai-slate">
          Manage your account and API configuration
        </p>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm font-medium text-ai-charcoal dark:text-ai-cloud">Current plan:</span>
        <Badge variant={planConfig.variant} size="sm" dot>{planConfig.label}</Badge>
      </div>

      <KeyVaultSection
        userPlan={(user?.plan ?? "FREE") as "FREE" | "PRO" | "BYOK"}
        hasKey={keyStatus?.hasKey ?? false}
        addedAt={keyStatus?.addedAt ?? null}
        lastUsedAt={keyStatus?.lastUsedAt ?? null}
        isStatusLoading={isStatusLoading}
        statusError={statusError}
        onSaveKey={handleSaveKey}
        onDeleteKey={handleDeleteKey}
        onRetry={handleRetry}
      />
    </div>
  );
}
