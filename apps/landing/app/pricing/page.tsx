import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { PricingPreview } from "@/components/landing/pricing-preview";
import { productSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Transparent pricing for every team size. Free to self-host, affordable in the cloud. No hidden fees.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing — Propsly",
    description:
      "Transparent pricing for every team size. Free to self-host, affordable in the cloud.",
    images: [
      {
        url: "/og?title=Pricing&description=Transparent+pricing+for+every+team+size",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    images: ["/og?title=Pricing&description=Transparent+pricing+for+every+team+size"],
  },
};

const faqs = [
  {
    question: "Is Propsly really free?",
    answer:
      "Yes, the core is free and open-source forever under AGPL-3.0. You can self-host it on your own infrastructure at no cost.",
  },
  {
    question: "What's included in the free plan?",
    answer:
      "Everything you need to get started: proposals, templates, tracking, e-signatures, and PDF export. The free cloud plan includes up to 3 active proposals.",
  },
  {
    question: "Can I self-host Propsly?",
    answer:
      "Yes. We provide a Docker image so you can run Propsly on your own server with full control over your data and no usage limits.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "Coming soon: we will accept all major credit cards and billing via Stripe for Pro and Team plans.",
  },
  {
    question: "Can I switch plans later?",
    answer:
      "Absolutely. You can upgrade, downgrade, or switch to self-hosting at any time. Your data is always yours.",
  },
];

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema()) }}
      />
      <Header />
      <main className="max-w-[var(--content-max-width)] mx-auto pt-32 pb-20 px-6">
        <div className="text-center mb-16">
          <h1 className="heading-display text-4xl sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p
            className="mt-4 text-lg max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Free to self-host. Affordable in the cloud. No surprises.
          </p>
        </div>

        <PricingPreview />

        {/* FAQ */}
        <section className="mt-24 max-w-[680px] mx-auto">
          <h2 className="heading-display text-2xl sm:text-3xl mb-10 text-center">
            Frequently asked questions
          </h2>
          <div className="divide-y" style={{ borderColor: "var(--border-default)" }}>
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="py-6"
                style={{ borderColor: "var(--border-default)" }}
              >
                <h3 className="font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                  {faq.question}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
