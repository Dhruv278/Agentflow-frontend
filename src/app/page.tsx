import {
  Navbar,
  Hero,
  Features,
  HowItWorks,
  AgentRoles,
  PricingPreview,
  CTASection,
  Footer,
} from "@/components/features/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <AgentRoles />
      <PricingPreview />
      <CTASection />
      <Footer />
    </div>
  );
}
