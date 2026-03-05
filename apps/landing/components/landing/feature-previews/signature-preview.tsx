"use client";

import { motion } from "framer-motion";

export function SignaturePreview() {
  return (
    <div className="space-y-4">
      <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>
        Sign below to accept this proposal
      </div>

      {/* Signature area */}
      <div
        className="rounded-lg p-4 relative"
        style={{ background: "var(--bg-primary)", border: "1px dashed var(--border-hover)" }}
      >
        <svg viewBox="0 0 240 60" className="w-full h-14">
          <motion.path
            d="M 15 40 C 25 10, 45 10, 55 30 S 75 50, 95 25 S 125 5, 145 30 C 155 40, 165 35, 175 20 Q 185 10, 200 25 L 220 20"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>
        <div className="text-xs mt-2" style={{ color: "var(--text-tertiary)" }}>
          Sarah Johnson
        </div>
      </div>

      {/* Signed badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.2, duration: 0.3 }}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
        style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span className="text-xs font-medium">Signed & accepted</span>
      </motion.div>
    </div>
  );
}
