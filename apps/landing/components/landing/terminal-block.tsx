"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";

const command = "docker compose up -d";

const outputLines = [
  "propsly-app     running on :3000",
  "propsly-db      running on :5432",
  "propsly-storage running on :9000",
];

function TerminalTypewriter({
  text,
  speed = 50,
  onDone,
}: {
  text: string;
  speed?: number;
  onDone?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");

  const handleDone = useCallback(() => {
    onDone?.();
  }, [onDone]);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        handleDone();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, handleDone]);

  return (
    <>
      {displayed}
      {displayed.length < text.length && (
        <span className="animate-pulse">_</span>
      )}
    </>
  );
}

export function TerminalBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [started, setStarted] = useState(false);
  const [commandDone, setCommandDone] = useState(false);

  useEffect(() => {
    if (isInView && !started) {
      setStarted(true);
    }
  }, [isInView, started]);

  return (
    <div
      ref={ref}
      className="rounded-xl overflow-hidden border font-mono text-sm"
      style={{ background: "#0d1117", borderColor: "var(--border-default)" }}
    >
      {/* Top bar */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: "#1b1f27" }}
      >
        <div className="flex gap-1.5">
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: "#ff5f57" }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: "#febc2e" }}
          />
          <div
            className="w-3 h-3 rounded-full"
            style={{ background: "#28c840" }}
          />
        </div>
        <span className="text-xs ml-2" style={{ color: "#484f58" }}>
          terminal
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-1">
        {started && (
          <div>
            <span style={{ color: "var(--accent)" }}>$ </span>
            <span style={{ color: "var(--text-primary)" }}>
              <TerminalTypewriter
                text={command}
                speed={50}
                onDone={() => setCommandDone(true)}
              />
            </span>
          </div>
        )}

        <AnimatePresence>
          {commandDone &&
            outputLines.map((line, i) => {
              const parts = line.split("running on ");
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4, duration: 0.3 }}
                >
                  <span style={{ color: "var(--accent)" }}>&#10003; </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {parts[0]}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    running on{" "}
                  </span>
                  <span style={{ color: "var(--text-tertiary)" }}>
                    :{parts[1]?.split(":")[1]}
                  </span>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
}
