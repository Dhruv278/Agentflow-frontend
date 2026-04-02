import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

/**
 * Auth layout — no navbar, no footer.
 * Each auth page owns its own visual structure via AuthLayoutShell.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
