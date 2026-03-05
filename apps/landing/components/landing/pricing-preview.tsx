"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { Glow } from "@/components/shared/glow";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Self-Host",
    price: "$0",
    period: "/forever",
    features: ["All features", "Your server", "Unlimited"],
    cta: "View Docs",
    href: "/docs",
    variant: "secondary" as const,
  },
  {
    name: "Free",
    price: "$0",
    period: "/month",
    features: ["3 proposals", "1 user", "Propsly watermark"],
    cta: "Sign Up",
    href: "/signup",
    variant: "secondary" as const,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/user/mo",
    features: ["Unlimited", "AI features", "Custom branding"],
    cta: "Sign Up",
    href: "/signup",
    popular: true,
    variant: "primary" as const,
  },
  {
    name: "Team",
    price: "$39",
    period: "/user/mo",
    features: ["+ CRM integration", "+ Team roles", "+ Approval flows"],
    cta: "Coming Soon",
    href: "#",
    comingSoon: true,
    variant: "disabled" as const,
  },
];

export function PricingPreview() {
  return (
    <SectionWrapper alt>
      <div className="text-center">
        <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl">
          Simple, honest <em className="italic">pricing.</em>
        </h2>
        <p className="mt-4 text-lg" style={{ color: "var(--text-secondary)" }}>
          Free to self-host. Affordable in the cloud.
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-[var(--grid-gap)]"
      >
        {tiers.map((tier) => (
          <motion.div
            key={tier.name}
            variants={staggerItem}
            className={cn(
              "relative flex flex-col rounded-[var(--card-radius)] p-[var(--card-padding)] border transition-all duration-300",
              tier.popular
                ? "bg-[var(--bg-elevated)] ring-1 ring-[var(--accent)]/30 border-[var(--accent-border)]"
                : "bg-[var(--bg-surface)] border-[var(--border-default)] hover:border-[var(--border-hover)]"
            )}
          >
            {tier.popular && (
              <>
                <Glow size="sm" className="opacity-30" />
                <span
                  className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-4"
                  style={{ background: "var(--accent)", color: "var(--text-inverse)" }}
                >
                  POPULAR
                </span>
              </>
            )}

            {tier.comingSoon && (
              <span
                className="absolute top-4 right-4 text-xs px-2 py-1 rounded-md"
                style={{ background: "var(--bg-elevated)", color: "var(--text-tertiary)" }}
              >
                Coming Soon
              </span>
            )}

            <h3 className="text-lg font-medium mb-4">{tier.name}</h3>
            <div className="mb-6">
              <span
                className="font-mono text-4xl font-bold"
                style={{ color: tier.popular ? "var(--accent)" : "var(--text-primary)" }}
              >
                {tier.price}
              </span>
              <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                {tier.period}
              </span>
            </div>

            <ul className="space-y-2 mb-8 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {tier.variant === "primary" ? (
              <Link href={tier.href} className="btn-primary w-full justify-center text-sm">
                {tier.cta}
              </Link>
            ) : tier.variant === "disabled" ? (
              <button
                disabled
                className="btn-secondary w-full justify-center text-sm opacity-50 cursor-not-allowed"
              >
                {tier.cta}
              </button>
            ) : (
              <Link href={tier.href} className="btn-secondary w-full justify-center text-sm">
                {tier.cta}
              </Link>
            )}
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
