import { Navbar, Footer } from "@/components/features/landing";
import { PricingPageContent } from "@/components/features/billing";

export const metadata = {
  title: "Pricing | AgentFlow",
  description: "Simple, transparent pricing for AI agent orchestration",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <PricingPageContent />
      </main>
      <Footer />
    </div>
  );
}
