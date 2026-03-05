"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Calculator,
  Globe,
  Eye,
  PenTool,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { cn } from "@/lib/utils";
import { EditorPreview } from "./feature-previews/editor-preview";
import { PricingPreview } from "./feature-previews/pricing-preview";
import { WebpagesPreview } from "./feature-previews/webpages-preview";
import { TrackingPreview } from "./feature-previews/tracking-preview";
import { SignaturePreview } from "./feature-previews/signature-preview";
import { AIPreview } from "./feature-previews/ai-preview";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  preview: React.ComponentType;
}

const features: Feature[] = [
  {
    id: "editor",
    title: "Block Editor",
    description: "Notion-like editor with slash commands, drag & drop blocks",
    icon: LayoutDashboard,
    preview: EditorPreview,
  },
  {
    id: "pricing",
    title: "Interactive Pricing",
    description: "Dynamic pricing tables with optional items and live totals",
    icon: Calculator,
    preview: PricingPreview,
  },
  {
    id: "webpages",
    title: "Web Pages",
    description: "Proposals as beautiful responsive web pages, not PDFs",
    icon: Globe,
    preview: WebpagesPreview,
  },
  {
    id: "tracking",
    title: "View Tracking",
    description: "Know who's reading, what they focus on, and when",
    icon: Eye,
    preview: TrackingPreview,
  },
  {
    id: "signatures",
    title: "E-Signatures",
    description: "Type or draw signatures, legally binding",
    icon: PenTool,
    preview: SignaturePreview,
  },
  {
    id: "ai",
    title: "AI-Powered",
    description: "Generate proposals from a brief in seconds",
    icon: Sparkles,
    preview: AIPreview,
  },
];

export function FeaturesTabs() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => {
    setActive((prev) => (prev + 1) % features.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(advance, 5000);
    return () => clearInterval(timer);
  }, [paused, advance]);

  const ActivePreview = features[active].preview;

  return (
    <SectionWrapper id="features">
      <p className="section-label text-center">FEATURES</p>
      <h2 className="heading-display text-3xl sm:text-4xl md:text-5xl text-center mb-16">
        Everything you need to win deals.
      </h2>

      <div
        className="flex flex-col md:flex-row gap-8"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Tab list */}
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:w-[280px] shrink-0">
          {features.map((feature, i) => {
            const isActive = active === i;
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => {
                  setActive(i);
                  setPaused(true);
                }}
                className={cn(
                  "flex-shrink-0 text-left rounded-lg px-4 py-3 transition-all duration-200",
                  isActive
                    ? "border-l-2 border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--text-primary)]"
                    : "border-l-2 border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
                )}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    size={16}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-[var(--accent)]" : "text-[var(--text-tertiary)]"
                    )}
                  />
                  <span className="text-sm font-medium">{feature.title}</span>
                </div>
                <div
                  className="text-xs mt-0.5 ml-6 hidden md:block"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {feature.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Preview area */}
        <div className="flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-6 min-h-[400px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ActivePreview />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  );
}
