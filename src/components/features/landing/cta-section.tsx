"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "w-4 h-4"}>
      <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
    </svg>
  );
}

export function CTASection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Content */}
          <div className="relative px-6 sm:px-12 lg:px-16 py-14 sm:py-20 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto leading-tight">
              Ready to build your first AI agent team?
            </h2>
            <p className="mt-5 text-lg text-indigo-100 max-w-xl mx-auto leading-relaxed">
              Join thousands of developers using AgentFlow to automate complex workflows with multi-agent AI pipelines.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/register">
                <Button
                  size="xl"
                  variant="secondary"
                  className="!bg-white !text-indigo-600 hover:!bg-indigo-50 !border-transparent shadow-lg"
                  rightIcon={<ArrowRightIcon />}
                >
                  Get Started for Free
                </Button>
              </Link>
              <a href="#pricing">
                <Button
                  size="xl"
                  variant="ghost"
                  className="!text-white hover:!bg-white/10"
                >
                  View Pricing
                </Button>
              </a>
            </div>

            {/* Bottom stats */}
            <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 max-w-2xl mx-auto">
              {[
                { value: "2,400+", label: "Developers" },
                { value: "50K+", label: "Agent Runs" },
                { value: "4.9/5", label: "Satisfaction" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-indigo-200 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
