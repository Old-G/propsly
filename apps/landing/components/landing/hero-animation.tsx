"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STAGE_DURATIONS = [2000, 2000, 2000, 1000, 2000, 1000, 2000];

function Typewriter({ text, speed = 50 }: { text: string; speed?: number }) {
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

  return (
    <>
      {displayed}
      <span className="animate-pulse">|</span>
    </>
  );
}

function PricingRow({
  label,
  amount,
  optional,
  checked,
  onToggle,
}: {
  label: string;
  amount: string;
  optional?: boolean;
  checked?: boolean;
  onToggle?: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: "var(--border-default)" }}>
      <div className="flex items-center gap-2">
        {optional && (
          <button
            type="button"
            onClick={onToggle}
            className="w-4 h-4 rounded border flex items-center justify-center text-xs"
            style={{
              borderColor: checked ? "var(--accent)" : "var(--border-hover)",
              background: checked ? "var(--accent)" : "transparent",
              color: checked ? "var(--text-inverse)" : "transparent",
            }}
          >
            {checked ? "\u2713" : ""}
          </button>
        )}
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {label}
          {optional && (
            <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--accent-muted)", color: "var(--accent)" }}>
              Optional
            </span>
          )}
        </span>
      </div>
      <span className="text-sm font-mono" style={{ color: "var(--text-primary)" }}>
        {amount}
      </span>
    </div>
  );
}

function AnimatedTotal({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    const steps = 20;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setDisplay(Math.round(start + (diff * step) / steps));
      if (step >= steps) clearInterval(interval);
    }, 25);
    return () => clearInterval(interval);
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className="font-mono font-semibold" style={{ color: "var(--accent)" }}>
      ${display.toLocaleString()}
    </span>
  );
}

export function HeroAnimation() {
  const [stage, setStage] = useState(0);
  const [optionalChecked, setOptionalChecked] = useState(false);

  const resetAnimation = useCallback(() => {
    setStage(0);
    setOptionalChecked(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (stage < 6) {
        if (stage === 2) {
          setOptionalChecked(false);
        }
        if (stage === 3) {
          setOptionalChecked(true);
        }
        setStage(stage + 1);
      } else {
        resetAnimation();
      }
    }, STAGE_DURATIONS[stage]);

    return () => clearTimeout(timer);
  }, [stage, resetAnimation]);

  return (
    <div
      className="w-full max-w-[700px] mx-auto rounded-xl overflow-hidden border"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border-default)",
      }}
    >
      {/* Browser top bar */}
      <div
        className="flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#3a3a3a" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#3a3a3a" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#3a3a3a" }} />
        </div>
        <div
          className="flex-1 text-xs font-mono px-3 py-1 rounded-md text-center"
          style={{
            background: "var(--bg-primary)",
            color: "var(--text-tertiary)",
          }}
        >
          propsly.org/p/acme-redesign
        </div>
      </div>

      {/* Content area — fixed height to prevent layout shift */}
      <div className="p-6 h-[520px] overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Stage 0: Logo + title typewriter */}
          {stage >= 0 && (
            <motion.div
              key="header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="w-8 h-8 rounded-lg mb-3 flex items-center justify-center text-xs font-bold"
                style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
              >
                A
              </div>
              <h3
                className="text-lg font-semibold mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {stage === 0 ? (
                  <Typewriter text="Web Development Proposal" speed={60} />
                ) : (
                  "Web Development Proposal"
                )}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 1: Subtitle */}
        <AnimatePresence>
          {stage >= 1 && (
            <motion.p
              key="subtitle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm mb-6"
              style={{ color: "var(--text-tertiary)" }}
            >
              Prepared for Sarah Johnson at TechCorp
            </motion.p>
          )}
        </AnimatePresence>

        {/* Stage 2: Pricing table */}
        <AnimatePresence>
          {stage >= 2 && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <div
                className="text-xs font-mono uppercase tracking-wider mb-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Pricing
              </div>
              <PricingRow label="UI/UX Design" amount="$4,500" />
              <PricingRow label="Frontend Development" amount="$8,200" />
              <PricingRow
                label="SEO Optimization"
                amount="$1,200"
                optional
                checked={optionalChecked}
                onToggle={() => setOptionalChecked(!optionalChecked)}
              />
              <div className="flex items-center justify-between pt-3">
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                  Total
                </span>
                <AnimatedTotal value={optionalChecked ? 13900 : 12700} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 4: Signature block */}
        <AnimatePresence>
          {stage >= 4 && (
            <motion.div
              key="signature"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-4 pt-4 border-t"
              style={{ borderColor: "var(--border-default)" }}
            >
              <div
                className="text-xs font-mono uppercase tracking-wider mb-3"
                style={{ color: "var(--text-tertiary)" }}
              >
                Signature
              </div>
              <div
                className="rounded-lg p-3 relative"
                style={{ background: "var(--bg-primary)", border: "1px dashed var(--border-hover)" }}
              >
                <svg
                  viewBox="0 0 200 60"
                  className="w-full h-12"
                  fill="none"
                >
                  <motion.path
                    d="M 10 40 C 20 10, 40 10, 50 30 S 70 50, 90 25 S 120 5, 140 30 C 150 40, 160 35, 170 20 Q 180 10, 190 25"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage 5: Signed badge */}
        <AnimatePresence>
          {stage >= 5 && (
            <motion.div
              key="signed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ background: "var(--accent-muted)", color: "var(--accent)" }}
            >
              Signed &#10003;
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
