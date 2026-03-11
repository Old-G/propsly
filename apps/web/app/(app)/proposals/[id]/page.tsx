import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { calculateEngagementScore } from "@/lib/engagement"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, BarChart3, Download } from "lucide-react"
import { ProposalActions } from "@/components/proposals/proposal-actions"

const STATUS_COLORS: Record<string, string> = {
  draft: "border-[var(--text-tertiary)]/30 text-[var(--text-tertiary)] bg-[var(--text-tertiary)]/10",
  sent: "border-[var(--info)]/30 text-[var(--info)] bg-[var(--info)]/10",
  viewed: "border-[var(--warning)]/30 text-[var(--warning)] bg-[var(--warning)]/10",
  signed: "border-[var(--success)]/30 text-[var(--success)] bg-[var(--success)]/10",
  expired: "border-[var(--error)]/30 text-[var(--error)] bg-[var(--error)]/10",
  declined: "border-[var(--error)]/30 text-[var(--error)] bg-[var(--error)]/10",
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date))
}

function formatCurrency(amount: string | null, currency: string | null) {
  if (!amount) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
    minimumFractionDigits: 0,
  }).format(parseFloat(amount))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: proposal } = await supabase
    .from("proposals")
    .select("title")
    .eq("id", id)
    .single()

  return {
    title: proposal?.title ?? "Proposal",
  }
}

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch proposal and engagement data in parallel (both only need id)
  const [{ data: proposal }, engagement] = await Promise.all([
    supabase
      .from("proposals")
      .select("*")
      .eq("id", id)
      .single(),
    calculateEngagementScore(id),
  ])

  if (!proposal) notFound()

  const avgTimeSeconds = engagement.views > 0
    ? Math.round(engagement.totalTimeMs / 1000 / engagement.views)
    : 0

  function formatTime(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`
  }

  function getScoreColor(score: number): string {
    if (score >= 70) return "var(--success)"
    if (score >= 40) return "var(--warning)"
    return "var(--error)"
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <Link
          href="/proposals"
          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Proposals
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={`/p/${proposal.slug}?pdf=true`}
            target="_blank"
            rel="noopener"
            className="flex items-center gap-2 rounded-md border border-[var(--border-default)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
          >
            <Download className="h-4 w-4" />
            PDF
          </a>
          <Link
            href={`/proposals/${proposal.id}/analytics`}
            className="flex items-center gap-2 rounded-md border border-[var(--border-default)] px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-hover)] transition-colors"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Link>
          <ProposalActions
            proposalId={proposal.id}
            proposalSlug={proposal.slug}
            proposalTitle={proposal.title}
          />
        </div>
      </div>

      {/* Title + Status */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{proposal.title}</h1>
          <Badge
            variant="outline"
            className={`capitalize ${STATUS_COLORS[proposal.status]}`}
          >
            {proposal.status}
          </Badge>
        </div>
        {proposal.client_name && (
          <p className="mt-1 text-[var(--text-secondary)]">
            {proposal.client_name}
            {proposal.client_company && ` · ${proposal.client_company}`}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Amount</p>
            <p className="mt-1 text-xl font-semibold">
              {formatCurrency(proposal.total_amount, proposal.currency)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Views</p>
            <p className="mt-1 text-xl font-semibold">{engagement.views}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Avg. Time</p>
            <p className="mt-1 text-xl font-semibold">{formatTime(avgTimeSeconds)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Coverage</p>
            <p className="mt-1 text-xl font-semibold">{engagement.sectionsCoveragePercent}%</p>
          </CardContent>
        </Card>
        <Card
          style={{
            "--engagement-color": getScoreColor(engagement.score),
          } as React.CSSProperties}
        >
          <CardContent className="p-4">
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Engagement</p>
            <div className="mt-1 flex items-center gap-3">
              <div
                className="relative flex h-12 w-12 items-center justify-center"
              >
                <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-[var(--border-default)]"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="none"
                    stroke="var(--engagement-color)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(engagement.score / 100) * 125.66} 125.66`}
                  />
                </svg>
                <span
                  className="absolute text-sm font-bold"
                  style={{ color: "var(--engagement-color)" }}
                >
                  {engagement.score}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Created</p>
            <p className="mt-1 text-sm font-medium">{formatDate(proposal.created_at)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Last Viewed</p>
            <p className="mt-1 text-sm font-medium">
              {proposal.viewed_at ? formatDate(proposal.viewed_at) : "Never"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-medium mb-4">Content</h2>
          <Card>
            <CardContent className="p-6">
              <p className="text-[var(--text-secondary)]">
                Editor coming in M1.4. For now, view the proposal at{" "}
                <a
                  href={`/p/${proposal.slug}`}
                  target="_blank"
                  rel="noopener"
                  className="text-[var(--accent)] hover:text-[var(--accent-hover)]"
                >
                  /p/{proposal.slug}
                </a>
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Details</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div>
                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Slug</p>
                <p className="mt-1 text-sm font-mono">{proposal.slug}</p>
              </div>
              {proposal.client_email && (
                <div>
                  <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Client Email</p>
                  <p className="mt-1 text-sm">{proposal.client_email}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Currency</p>
                <p className="mt-1 text-sm">{proposal.currency ?? "USD"}</p>
              </div>
              {proposal.expires_at && (
                <div>
                  <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Expires</p>
                  <p className="mt-1 text-sm">{formatDate(proposal.expires_at)}</p>
                </div>
              )}
              {proposal.sent_at && (
                <div>
                  <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Sent</p>
                  <p className="mt-1 text-sm">{formatDate(proposal.sent_at)}</p>
                </div>
              )}
              {proposal.signed_at && (
                <div>
                  <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Signed</p>
                  <p className="mt-1 text-sm">{formatDate(proposal.signed_at)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
