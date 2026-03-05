import { Header } from "@/components/shared/header";
import { Hero } from "@/components/landing/hero";
import { Problem } from "@/components/landing/problem";
import { FeaturesTabs } from "@/components/landing/features-tabs";
import { HowItWorks } from "@/components/landing/how-it-works";
import { OpenSourceSection } from "@/components/landing/open-source-section";
import { PricingPreview } from "@/components/landing/pricing-preview";
import { FinalCTA } from "@/components/landing/final-cta";
import { Footer } from "@/components/shared/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <FeaturesTabs />
        <HowItWorks />
        <OpenSourceSection />
        <PricingPreview />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
