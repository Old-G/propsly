"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const messages = [
  { role: "user" as const, text: "Write an introduction for a web redesign proposal" },
  {
    role: "ai" as const,
    text: "We're excited to partner with TechCorp on a complete redesign of your customer portal. Our approach focuses on three key areas: modern UI patterns, improved accessibility, and performance optimization...",
  },
];

function Typewriter({ text, speed = 20 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return <>{displayed}</>;
}

export function AIPreview() {
  return (
    <div className="space-y-3">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 1.5 }}
          className="flex gap-2"
        >
          <div
            className="mt-0.5 h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-medium"
            style={{
              background: msg.role === "ai" ? "var(--accent-muted)" : "var(--bg-primary)",
              color: msg.role === "ai" ? "var(--accent)" : "var(--text-tertiary)",
            }}
          >
            {msg.role === "ai" ? "AI" : "U"}
          </div>
          <div
            className="text-sm leading-relaxed"
            style={{ color: msg.role === "ai" ? "var(--text-primary)" : "var(--text-secondary)" }}
          >
            {msg.role === "ai" ? <Typewriter text={msg.text} speed={15} /> : msg.text}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
