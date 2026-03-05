"use client";

import { motion } from "framer-motion";

const sections = [
  { name: "Introduction", pct: 95 },
  { name: "Our Approach", pct: 80 },
  { name: "Pricing", pct: 100 },
  { name: "Timeline", pct: 45 },
  { name: "Next Steps", pct: 20 },
];

export function TrackingPreview() {
  return (
    <div className="space-y-4">
      {/* Engagement score */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between"
      >
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Engagement Score</span>
        <span className="font-mono text-lg font-semibold" style={{ color: "var(--accent)" }}>78%</span>
      </motion.div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Views", value: "12" },
          { label: "Avg. Time", value: "4:32" },
          { label: "Last Seen", value: "2h ago" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-lg p-2 text-center"
            style={{ background: "var(--bg-primary)" }}
          >
            <div className="font-mono text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              {stat.value}
            </div>
            <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Section heatmap */}
      <div className="space-y-2">
        <div className="text-xs" style={{ color: "var(--text-tertiary)" }}>Section Heatmap</div>
        {sections.map((section, i) => (
          <motion.div
            key={section.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs w-24 shrink-0" style={{ color: "var(--text-secondary)" }}>
              {section.name}
            </span>
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-primary)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${section.pct}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                className="h-full rounded-full"
                style={{
                  background: section.pct > 70 ? "var(--accent)" : section.pct > 40 ? "var(--warning)" : "var(--text-tertiary)",
                }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
