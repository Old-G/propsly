"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Glow } from "@/components/shared/glow";
import { HeroAnimation } from "./hero-animation";

export function Hero() {
  return (
    <section className="relative z-10 min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 px-6">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center max-w-4xl mx-auto"
      >
        <motion.p variants={fadeInUp} className="section-label">
          OPEN-SOURCE PROPOSAL PLATFORM
        </motion.p>

        <motion.h1
          variants={fadeInUp}
          className="heading-display text-5xl sm:text-6xl md:text-7xl lg:text-[80px] mb-6"
        >
          Create proposals that{" "}
          <em className="italic">close deals.</em>
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl max-w-[600px] mb-10"
          style={{ color: "var(--text-secondary)" }}
        >
          Beautiful interactive proposals as web pages. Interactive pricing.
          View tracking. E-signatures. Self-hosted or cloud. Free and
          open-source.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/signup" className="btn-primary">
            Get Started Free &rarr;
          </Link>
          <a
            href="https://github.com/Old-G/propsly"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
            </svg>
            Star on GitHub
          </a>
        </motion.div>
      </motion.div>

      {/* Animated proposal preview */}
      <div className="relative mt-16 w-full max-w-[700px] mx-auto">
        <Glow size="lg" className="opacity-40" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative"
        >
          <HeroAnimation />
        </motion.div>
      </div>
    </section>
  );
}
