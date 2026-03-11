import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getProposalAnalytics } from "@/lib/actions/analytics"
import { EngagementBadge } from "@/components/analytics/engagement-badge"
import { AnalyticsStats } from "@/components/analytics/analytics-stats"
import { SectionHeatmap } from "@/components/analytics/section-heatmap"
import { ViewsOverTime } from "@/components/analytics/views-over-time"
import { ViewHistoryTable } from "@/components/analytics/view-history-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, BarChart3 } from "lucide-react"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("proposals").select("title").eq("id", id).single()
  return { title: data?.title ? `Analytics: ${data.title}` : "Analytics" }
}

export default async function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: proposal } = await supabase
    .from("proposals")
    .select("id, title, status, slug")
    .eq("id", id)
    .single()

  if (!proposal) notFound()

  const analytics = await getProposalAnalytics(id)

  return (
    <div className="p-6 space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href={`/proposals/${id}`}
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Proposal
        </Link>
      </div>

      {/* Title */}
      <div className="flex items-center gap-3">
        <BarChart3 className="h-5 w-5 text-[var(--accent)]" />
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <Badge variant="outline" className="text-[var(--text-secondary)]">
          {proposal.title}
        </Badge>
      </div>

      {/* Stats Row */}
      <AnalyticsStats
        totalViews={analytics.engagement.views}
        uniqueViewers={analytics.uniqueViewers}
        avgTimeSeconds={analytics.avgTimeSeconds}
        revisits={analytics.engagement.revisits}
      />

      {/* Main Grid: Engagement + Views Over Time */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-center p-6">
            <EngagementBadge {...analytics.engagement} />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <ViewsOverTime data={analytics.viewsOverTime} />
        </div>
      </div>

      {/* Section Heatmap */}
      <SectionHeatmap data={analytics.sectionHeatmap} />

      {/* View History */}
      <ViewHistoryTable views={analytics.viewHistory} />
    </div>
  )
}
