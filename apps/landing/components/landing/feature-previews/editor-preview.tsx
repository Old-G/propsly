"use client";

import { motion } from "framer-motion";

const blocks = [
  { type: "h1", content: "Project Overview" },
  { type: "p", content: "We'll redesign your platform with a modern, accessible interface..." },
  { type: "h2", content: "Timeline & Deliverables" },
  { type: "p", content: "Phase 1: Research & wireframes (2 weeks)" },
  { type: "img", content: "" },
];

export function EditorPreview() {
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15, duration: 0.4 }}
          className="flex items-start gap-3"
        >
          <div
            className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px]"
            style={{ background: "var(--bg-primary)", color: "var(--text-tertiary)" }}
          >
            {block.type === "h1" ? "H1" : block.type === "h2" ? "H2" : block.type === "img" ? "Img" : "T"}
          </div>
          <div className="flex-1">
            {block.type === "img" ? (
              <div
                className="h-16 w-full rounded-lg"
                style={{ background: "var(--bg-primary)", border: "1px dashed var(--border-hover)" }}
              />
            ) : (
              <div
                className={block.type.startsWith("h") ? "font-medium" : "text-sm"}
                style={{ color: block.type.startsWith("h") ? "var(--text-primary)" : "var(--text-secondary)" }}
              >
                {block.content}
              </div>
            )}
          </div>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="ml-8 h-5 w-0.5"
        style={{ background: "var(--accent)" }}
      />
    </div>
  );
}
