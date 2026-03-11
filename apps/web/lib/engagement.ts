import { createClient } from "@/lib/supabase/server"

interface EngagementResult {
  score: number
  views: number
  totalTimeMs: number
  sectionsViewed: number
  totalSections: number
  sectionsCoveragePercent: number
  revisits: number
}

/**
 * Calculate an engagement score (0-100) for a proposal based on:
 * - View count (max 30 points)
 * - Total viewing time (max 60 points)
 * - Section coverage percentage (max 30 points)
 * - Revisits (max 30 points)
 *
 * Final score is capped at 100.
 */
export async function calculateEngagementScore(
  proposalId: string
): Promise<EngagementResult> {
  const supabase = await createClient()

  // Get view count
  const { count: viewCount } = await supabase
    .from("proposal_views")
    .select("*", { count: "exact", head: true })
    .eq("proposal_id", proposalId)

  const views = viewCount ?? 0

  // Get unique viewer IPs for revisit calculation
  const { data: viewData } = await supabase
    .from("proposal_views")
    .select("viewer_ip, viewed_at")
    .eq("proposal_id", proposalId)
    .order("viewed_at", { ascending: true })

  // Calculate revisits: total views minus unique IPs
  const uniqueIps = new Set(
    (viewData ?? [])
      .map((v) => v.viewer_ip)
      .filter((ip): ip is string => ip !== null)
  )
  const revisits = Math.max(0, views - uniqueIps.size)

  // Get section view data — aggregate total time and distinct blocks
  const { data: sectionData } = await supabase
    .from("section_views")
    .select("block_id, time_spent_ms")
    .eq("proposal_id", proposalId)

  // Calculate total time across all sections
  const totalTimeMs = (sectionData ?? []).reduce(
    (sum, row) => sum + (row.time_spent_ms ?? 0),
    0
  )

  // Get distinct sections viewed
  const distinctBlocks = new Set(
    (sectionData ?? []).map((row) => row.block_id).filter(Boolean)
  )
  const sectionsViewed = distinctBlocks.size

  // Estimate total sections from the proposal content
  // We get the max number of distinct blocks ever tracked for this proposal
  // If no sections tracked yet, we use a default
  const totalSections = Math.max(sectionsViewed, 1)

  // Get actual section count from content if possible
  const { data: proposal } = await supabase
    .from("proposals")
    .select("content")
    .eq("id", proposalId)
    .single()

  let actualTotalSections = totalSections
  if (proposal?.content) {
    const content = proposal.content as { content?: Array<Record<string, unknown>> }
    if (content.content && Array.isArray(content.content)) {
      actualTotalSections = content.content.length
    }
  }

  // Calculate coverage percentage
  const sectionsCoveragePercent =
    actualTotalSections > 0
      ? Math.min(100, Math.round((sectionsViewed / actualTotalSections) * 100))
      : 0

  // Calculate score components
  const viewsScore = Math.min(30, views * 10)
  const totalTimeSec = totalTimeMs / 1000
  const timeScore = Math.min(60, totalTimeSec * 0.2)
  const coverageScore = (sectionsCoveragePercent / 100) * 30
  const revisitScore = Math.min(30, revisits * 15)

  const score = Math.min(100, Math.round(viewsScore + timeScore + coverageScore + revisitScore))

  return {
    score,
    views,
    totalTimeMs,
    sectionsViewed,
    totalSections: actualTotalSections,
    sectionsCoveragePercent,
    revisits,
  }
}
