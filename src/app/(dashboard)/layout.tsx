import type { Metadata } from "next";
import { DashboardShell } from "@/components/features/dashboard";

export const metadata: Metadata = {
  title: "Dashboard | AgentFlow",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
