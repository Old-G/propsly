"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { APP_URL } from "@/lib/utils";
import { Glow } from "@/components/shared/glow";

export function FinalCTA() {
  return (
    <section className="relative z-10 py-[var(--section-padding-y-mobile)] md:py-[var(--section-padding-y)] px-[var(--content-padding-x)] overflow-hidden bg-[var(--bg-primary)]">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-10 mx-auto max-w-[var(--content-narrow)] text-center"
      >
        <motion.h2
          variants={fadeInUp}
          className="heading-display text-3xl sm:text-4xl md:text-5xl mb-6"
        >
          Ready to send <em className="italic">better proposals?</em>
        </motion.h2>
        <motion.p
          variants={fadeInUp}
          className="text-lg mb-10"
          style={{ color: "var(--text-secondary)" }}
        >
          Create beautiful proposals in minutes. Free, open-source, and
          ready to use — no credit card required.
        </motion.p>
        <motion.div variants={fadeInUp} className="relative inline-block">
          <Glow size="md" className="opacity-50" />
          <a href={`${APP_URL}/signup`} className="btn-primary relative text-base px-10 py-4">
            Try Propsly Free &rarr;
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
