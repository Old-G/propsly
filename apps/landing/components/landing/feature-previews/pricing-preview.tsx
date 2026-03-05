"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const rows = [
  { label: "UI/UX Design", amount: 4500 },
  { label: "Frontend Dev", amount: 8200 },
  { label: "SEO Package", amount: 1200, optional: true },
];

export function PricingPreview() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setChecked((c) => !c), 2000);
    return () => clearInterval(interval);
  }, []);

  const total = rows.reduce(
    (sum, r) => sum + (r.optional && !checked ? 0 : r.amount),
    0
  );

  return (
    <div className="space-y-1">
      {rows.map((row, i) => (
        <motion.div
          key={row.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center justify-between py-2 border-b"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div className="flex items-center gap-2 text-sm">
            {row.optional && (
              <div
                className="h-3.5 w-3.5 rounded border flex items-center justify-center transition-all duration-300"
                style={{
                  borderColor: checked ? "var(--accent)" : "var(--border-hover)",
                  background: checked ? "var(--accent)" : "transparent",
                }}
              >
                {checked && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="var(--text-inverse)" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            )}
            <span style={{ color: "var(--text-secondary)" }}>{row.label}</span>
            {row.optional && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded"
                style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
              >
                Optional
              </span>
            )}
          </div>
          <span className="text-sm font-mono" style={{ color: "var(--text-primary)" }}>
            ${row.amount.toLocaleString()}
          </span>
        </motion.div>
      ))}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Total</span>
        <motion.span
          key={total}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono font-semibold"
          style={{ color: "var(--accent)" }}
        >
          ${total.toLocaleString()}
        </motion.span>
      </div>
    </div>
  );
}
