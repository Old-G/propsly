"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

interface EngagementBadgeProps {
  score: number
  views: number
  totalTimeMs: number
  sectionsViewed: number
  totalSections: number
  sectionsCoveragePercent: number
  revisits: number
}

function getScoreLabel(score: number) {
  if (score >= 70) return "Hot"
  if (score >= 40) return "Warm"
  return "Cold"
}

function getScoreColor(score: number) {
  if (score >= 70) return "var(--success)"
  if (score >= 40) return "var(--warning)"
  return "var(--error)"
}

export function EngagementBadge({ score, views, totalTimeMs, sectionsCoveragePercent, revisits }: EngagementBadgeProps) {
  const color = getScoreColor(score)
  const label = getScoreLabel(score)
  const circumference = 2 * Math.PI * 54
  const strokeDashoffset = circumference - (score / 100) * circumference

  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => Math.round(v))

  useEffect(() => {
    const controls = animate(count, score, { duration: 1.5, ease: "easeOut" })
    return controls.stop
  }, [score, count])

  const totalTimeSec = Math.round(totalTimeMs / 1000)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="relative flex items-center justify-center">
        <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
          <circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke="var(--border-default)"
            strokeWidth="6"
          />
          <motion.circle
            cx="60" cy="60" r="54"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <motion.span className="text-3xl font-bold" style={{ color }}>
            {rounded}
          </motion.span>
          <span className="text-xs font-medium uppercase tracking-wider" style={{ color }}>
            {label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        <div className="text-[var(--text-tertiary)]">Views</div>
        <div className="text-right font-medium">{views}</div>
        <div className="text-[var(--text-tertiary)]">Time Spent</div>
        <div className="text-right font-medium">{totalTimeSec < 60 ? `${totalTimeSec}s` : `${Math.floor(totalTimeSec / 60)}m ${totalTimeSec % 60}s`}</div>
        <div className="text-[var(--text-tertiary)]">Coverage</div>
        <div className="text-right font-medium">{sectionsCoveragePercent}%</div>
        <div className="text-[var(--text-tertiary)]">Revisits</div>
        <div className="text-right font-medium">{revisits}</div>
      </div>
    </motion.div>
  )
}
