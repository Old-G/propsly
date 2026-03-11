"use client"

import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent } from "@/components/ui/card"

interface SectionHeatmapProps {
  data: {
    blockId: string
    blockType: string
    totalTimeMs: number
    label: string
  }[]
}

function formatTime(ms: number): string {
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
}

function getBarColor(index: number, total: number): string {
  const opacity = 1 - (index / Math.max(total - 1, 1)) * 0.6
  return `rgba(52, 211, 153, ${opacity})`
}

export function SectionHeatmap({ data }: SectionHeatmapProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-[var(--text-tertiary)]">
          No section data yet. Views will show engagement per section.
        </CardContent>
      </Card>
    )
  }

  const chartData = data.slice(0, 15).map((item) => ({
    name: item.label,
    time: Math.round(item.totalTimeMs / 1000),
    timeLabel: formatTime(item.totalTimeMs),
  }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardContent className="p-6">
          <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--text-tertiary)] mb-4">
            Time per Section
          </h3>
          <div style={{ height: Math.max(chartData.length * 40 + 20, 200) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20, top: 0, bottom: 0 }}>
                <XAxis
                  type="number"
                  tickFormatter={(v) => `${v}s`}
                  stroke="var(--text-tertiary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  stroke="var(--text-tertiary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null
                    const d = payload[0].payload
                    return (
                      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 text-sm shadow-lg">
                        <p className="font-medium">{d.name}</p>
                        <p className="text-[var(--text-secondary)]">{d.timeLabel}</p>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="time" radius={[0, 4, 4, 0]} animationDuration={1000}>
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={getBarColor(index, chartData.length)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
