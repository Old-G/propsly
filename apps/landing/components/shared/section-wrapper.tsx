"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  alt?: boolean;
}

export function SectionWrapper({
  children,
  className,
  id,
  alt,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className={cn(
        "py-[var(--section-padding-y-mobile)] md:py-[var(--section-padding-y)] px-[var(--content-padding-x)]",
        alt && "bg-[var(--bg-section-alt)]",
        className
      )}
    >
      <div className="mx-auto max-w-[var(--content-max-width)]">
        {children}
      </div>
    </motion.section>
  );
}
