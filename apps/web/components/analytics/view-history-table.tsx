"use client"

import { motion } from "framer-motion"
import { Monitor, Smartphone, Tablet } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { ViewRecord } from "@/lib/actions/analytics"

interface ViewHistoryTableProps {
  views: ViewRecord[]
}

function getDeviceIcon(device: string | null) {
  switch (device) {
    case "mobile": return Smartphone
    case "tablet": return Tablet
    default: return Monitor
  }
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(dateStr))
}

function maskIp(ip: string | null): string {
  if (!ip) return "Unknown"
  const parts = ip.split(".")
  if (parts.length === 4) return `${parts[0]}.${parts[1]}.***`
  return ip.slice(0, 8) + "***"
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

export function ViewHistoryTable({ views }: ViewHistoryTableProps) {
  if (views.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-[var(--text-tertiary)]">
          No views yet. Share your proposal to start tracking.
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
            View History
          </h3>
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-1">
            {views.slice(0, 20).map((view) => {
              const DeviceIcon = getDeviceIcon(view.viewerDevice)
              return (
                <motion.div
                  key={view.id}
                  variants={item}
                  className="flex items-center gap-4 rounded-lg px-3 py-2 hover:bg-[var(--bg-surface-hover)] transition-colors"
                >
                  <DeviceIcon className="h-4 w-4 flex-shrink-0 text-[var(--text-tertiary)]" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium capitalize">{view.viewerDevice ?? "desktop"}</span>
                      {view.viewerLocation && (
                        <span className="text-xs text-[var(--text-tertiary)]">{view.viewerLocation}</span>
                      )}
                    </div>
                    <span className="text-xs text-[var(--text-tertiary)]">{maskIp(view.viewerIp)}</span>
                  </div>
                  <span className="text-xs text-[var(--text-tertiary)] flex-shrink-0">
                    {timeAgo(view.viewedAt)}
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
