"use server"

import { createClient } from "@/lib/supabase/server"
import { calculateEngagementScore } from "@/lib/engagement"

export interface ViewRecord {
  id: string
  viewerIp: string | null
  viewerLocation: string | null
  viewerDevice: string | null
  viewerUa: string | null
  viewedAt: string
}

export interface SectionHeatmapItem {
  blockId: string
  blockType: string
  totalTimeMs: number
  label: string
}

export interface AnalyticsData {
  engagement: {
    score: number
    views: number
    totalTimeMs: number
    sectionsViewed: number
    totalSections: number
    sectionsCoveragePercent: number
    revisits: number
  }
  uniqueViewers: number
  avgTimeSeconds: number
  viewHistory: ViewRecord[]
  sectionHeatmap: SectionHeatmapItem[]
  viewsOverTime: { date: string; views: number }[]
}

export async function getProposalAnalytics(proposalId: string): Promise<AnalyticsData> {
  const supabase = await createClient()

  const engagement = await calculateEngagementScore(proposalId)

  const { data: views } = await supabase
    .from("proposal_views")
    .select("id, viewer_ip, viewer_location, viewer_device, viewer_ua, viewed_at")
    .eq("proposal_id", proposalId)
    .order("viewed_at", { ascending: false })
    .limit(100)

  const viewHistory: ViewRecord[] = (views ?? []).map((v) => ({
    id: v.id,
    viewerIp: v.viewer_ip,
    viewerLocation: v.viewer_location,
    viewerDevice: v.viewer_device,
    viewerUa: v.viewer_ua,
    viewedAt: v.viewed_at,
  }))

  const uniqueIps = new Set(viewHistory.map((v) => v.viewerIp).filter(Boolean))
  const uniqueViewers = uniqueIps.size

  const avgTimeSeconds = engagement.views > 0
    ? Math.round(engagement.totalTimeMs / 1000 / engagement.views)
    : 0

  const { data: sectionData } = await supabase
    .from("section_views")
    .select("block_id, block_type, time_spent_ms")
    .eq("proposal_id", proposalId)

  const blockMap = new Map<string, { blockType: string; totalTimeMs: number }>()
  for (const row of sectionData ?? []) {
    if (!row.block_id) continue
    const existing = blockMap.get(row.block_id)
    if (existing) {
      existing.totalTimeMs += row.time_spent_ms ?? 0
    } else {
      blockMap.set(row.block_id, {
        blockType: row.block_type ?? "unknown",
        totalTimeMs: row.time_spent_ms ?? 0,
      })
    }
  }

  const sectionHeatmap: SectionHeatmapItem[] = Array.from(blockMap.entries())
    .map(([blockId, data]) => ({
      blockId,
      blockType: data.blockType,
      totalTimeMs: data.totalTimeMs,
      label: formatBlockLabel(data.blockType),
    }))
    .sort((a, b) => b.totalTimeMs - a.totalTimeMs)

  const viewsByDate = new Map<string, number>()
  for (const v of viewHistory) {
    const date = new Date(v.viewedAt).toISOString().split("T")[0]
    viewsByDate.set(date, (viewsByDate.get(date) ?? 0) + 1)
  }
  const viewsOverTime = Array.from(viewsByDate.entries())
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    engagement,
    uniqueViewers,
    avgTimeSeconds,
    viewHistory,
    sectionHeatmap,
    viewsOverTime,
  }
}

function formatBlockLabel(blockType: string): string {
  const labels: Record<string, string> = {
    heading: "Heading",
    paragraph: "Paragraph",
    image: "Image",
    video: "Video",
    pricingTable: "Pricing Table",
    signatureBlock: "Signature",
    testimonial: "Testimonial",
    divider: "Divider",
    tableOfContents: "Table of Contents",
    bulletList: "Bullet List",
    orderedList: "Ordered List",
    blockquote: "Blockquote",
    codeBlock: "Code Block",
  }
  return labels[blockType] ?? blockType.charAt(0).toUpperCase() + blockType.slice(1)
}
