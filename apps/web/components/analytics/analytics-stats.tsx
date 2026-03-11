"use client"

import { motion } from "framer-motion"
import { Eye, Users, Clock, RotateCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface AnalyticsStatsProps {
  totalViews: number
  uniqueViewers: number
  avgTimeSeconds: number
  revisits: number
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

export function AnalyticsStats({ totalViews, uniqueViewers, avgTimeSeconds, revisits }: AnalyticsStatsProps) {
  const stats = [
    { label: "Total Views", value: totalViews.toString(), icon: Eye },
    { label: "Unique Viewers", value: uniqueViewers.toString(), icon: Users },
    { label: "Avg. Time", value: formatTime(avgTimeSeconds), icon: Clock },
    { label: "Revisits", value: revisits.toString(), icon: RotateCcw },
  ]

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={item}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-[var(--text-tertiary)]" />
                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">{stat.label}</p>
              </div>
              <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
