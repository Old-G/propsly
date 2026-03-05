"use client";

import { motion } from "framer-motion";
import { FileText, DollarSign, Lock } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { staggerContainer, staggerItem } from "@/lib/animations";

const cards = [
  {
    icon: FileText,
    title: "PDF Chaos",
    description:
      "Word \u2192 PDF \u2192 email \u2192 zero tracking. Did they even open it? You\u2019ll never know.",
  },
  {
    icon: DollarSign,
    title: "$50/user/month",
    description:
      "PandaDoc just cut features from their Starter plan. Team of 5 = $250+/mo for basic proposals.",
  },
  {
    icon: Lock,
    title: "No OSS Option",
    description:
      "Documenso does signing. Nobody builds the proposal itself. Your data, their servers, their rules.",
  },
];

export function Problem() {
  return (
    <SectionWrapper alt>
      <p className="section-label text-center">THE PROBLEM</p>
      <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl text-center mb-16">
        Proposals shouldn&apos;t be <em>this painful.</em>
      </h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid md:grid-cols-3 gap-[var(--grid-gap)]"
      >
        {cards.map((card) => (
          <motion.div
            key={card.title}
            variants={staggerItem}
            className="group relative rounded-[var(--card-radius)] bg-[var(--bg-surface)] p-[var(--card-padding)] border border-[var(--border-default)] transition-all duration-300 hover:border-[var(--border-hover)] hover:bg-[var(--bg-surface-hover)] hover:-translate-y-0.5"
          >
            {/* Gradient border overlay */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[var(--card-radius)] p-px"
              style={{
                background:
                  "linear-gradient(to bottom right, var(--accent-border), transparent, var(--border-default))",
                mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                maskComposite: "exclude",
                WebkitMaskComposite: "xor",
              }}
            />
            <card.icon
              size={32}
              strokeWidth={1.5}
              className="text-secondary mb-4 transition-colors group-hover:text-accent"
            />
            <h3 className="text-lg font-medium mb-2">{card.title}</h3>
            <p className="text-sm text-secondary leading-relaxed">
              {card.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
