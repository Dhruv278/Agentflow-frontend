import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AgentFlow — Build AI Agent Teams That Think Together",
  description:
    "Create teams of specialized AI agents — Researcher, Writer, Reviewer, Coder — that collaborate on a single goal. Bring your own API key or use platform credits.",
  keywords: [
    "AI agents",
    "multi-agent orchestration",
    "LLM",
    "AI automation",
    "agent pipeline",
    "OpenRouter",
    "GPT-4",
    "Claude",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
