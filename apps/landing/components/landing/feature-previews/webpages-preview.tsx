"use client";

import { motion } from "framer-motion";

export function WebpagesPreview() {
  return (
    <div className="flex items-end justify-center gap-6">
      {/* Desktop mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-48 rounded-lg border overflow-hidden"
        style={{ borderColor: "var(--border-default)", background: "var(--bg-surface)" }}
      >
        <div className="flex gap-1 px-2 py-1.5 border-b" style={{ borderColor: "var(--border-default)" }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--text-tertiary)" }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--text-tertiary)" }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--text-tertiary)" }} />
        </div>
        <div className="p-3 space-y-2">
          <div className="h-2 w-3/4 rounded" style={{ background: "var(--text-tertiary)" }} />
          <div className="h-1.5 w-full rounded" style={{ background: "var(--border-hover)" }} />
          <div className="h-1.5 w-5/6 rounded" style={{ background: "var(--border-hover)" }} />
          <div className="h-8 w-full rounded mt-3" style={{ background: "var(--bg-primary)" }} />
          <div className="h-1.5 w-2/3 rounded" style={{ background: "var(--border-hover)" }} />
        </div>
      </motion.div>

      {/* Mobile mockup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-20 rounded-xl border overflow-hidden"
        style={{ borderColor: "var(--border-default)", background: "var(--bg-surface)" }}
      >
        <div className="flex justify-center py-1">
          <div className="w-8 h-1 rounded-full" style={{ background: "var(--border-hover)" }} />
        </div>
        <div className="p-2 space-y-1.5">
          <div className="h-1.5 w-3/4 rounded" style={{ background: "var(--text-tertiary)" }} />
          <div className="h-1 w-full rounded" style={{ background: "var(--border-hover)" }} />
          <div className="h-1 w-5/6 rounded" style={{ background: "var(--border-hover)" }} />
          <div className="h-5 w-full rounded mt-2" style={{ background: "var(--bg-primary)" }} />
          <div className="h-1 w-1/2 rounded" style={{ background: "var(--border-hover)" }} />
        </div>
      </motion.div>
    </div>
  );
}
