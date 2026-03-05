"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { staggerContainer, staggerItem } from "@/lib/animations";

const steps = [
  {
    num: "01",
    title: "Create",
    description:
      "Pick a template or start blank. Add your content and pricing.",
  },
  {
    num: "02",
    title: "Send",
    description:
      "Share a link. Client sees a beautiful web page, not a PDF attachment.",
  },
  {
    num: "03",
    title: "Close",
    description:
      "Track who's reading. Get signatures. Collect payment.",
  },
];

export function HowItWorks() {
  return (
    <SectionWrapper alt>
      <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl text-center mb-16">
        Three steps. <em className="italic">Zero friction.</em>
      </h2>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative grid md:grid-cols-3 gap-12 md:gap-8"
      >
        {/* Connecting dashed line between step numbers (desktop only) */}
        <div className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] border-t border-dashed border-[var(--text-tertiary)]/30" />

        {steps.map((step) => (
          <motion.div key={step.num} variants={staggerItem} className="relative text-center">
            <div className="text-4xl sm:text-5xl font-mono font-bold text-[var(--accent)] mb-4">
              {step.num}
            </div>
            <h3 className="text-xl font-medium mb-2">{step.title}</h3>
            <p className="text-sm leading-relaxed max-w-[240px] mx-auto text-[var(--text-secondary)]">
              {step.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
