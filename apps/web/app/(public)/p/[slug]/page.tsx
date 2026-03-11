import { notFound } from "next/navigation"
import { headers } from "next/headers"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ProposalViewerClient } from "./proposal-viewer-client"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: proposal } = await supabase
    .from("proposals")
    .select("title, client_name, client_company")
    .eq("slug", slug)
    .single()

  if (!proposal) {
    return { title: "Proposal Not Found" }
  }

  const description = [
    proposal.client_name && `Prepared for ${proposal.client_name}`,
    proposal.client_company && `at ${proposal.client_company}`,
  ]
    .filter(Boolean)
    .join(" ") || "View this proposal"

  return {
    title: proposal.title,
    description,
    openGraph: {
      title: proposal.title,
      description,
      type: "article",
    },
    robots: {
      index: false,
      follow: false,
    },
  }
}

async function recordView(proposalId: string) {
  const supabase = await createClient()
  const headersList = await headers()

  const forwardedFor = headersList.get("x-forwarded-for")
  const viewerIp = forwardedFor?.split(",")[0]?.trim() ?? headersList.get("x-real-ip") ?? null
  const userAgent = headersList.get("user-agent") ?? null

  await supabase.from("proposal_views").insert({
    proposal_id: proposalId,
    viewer_ip: viewerIp,
    user_agent: userAgent,
  })

  // Update the proposal's viewed_at timestamp
  await supabase
    .from("proposals")
    .update({ viewed_at: new Date().toISOString() })
    .eq("id", proposalId)
}

export default async function ProposalViewPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: proposal } = await supabase
    .from("proposals")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!proposal) {
    notFound()
  }

  // Draft proposals are not publicly viewable
  if (proposal.status === "draft") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-4 text-6xl">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-[var(--text-tertiary)]"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold text-[var(--text-primary)]">
          This proposal is not available yet
        </h1>
        <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
          The author is still working on this proposal. Check back later.
        </p>
      </div>
    )
  }

  // Record the view (fire and forget — don't block rendering)
  recordView(proposal.id).catch(() => {
    // Silently ignore view tracking errors
  })

  const content = proposal.content as Record<string, unknown> | null

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-[var(--border-default)] bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-[var(--content-narrow)] px-[var(--content-padding-x)] py-6 sm:py-8">
          <h1 className="heading-display text-2xl sm:text-3xl lg:text-4xl">
            {proposal.title}
          </h1>
          {(proposal.client_name || proposal.client_company) && (
            <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">
              {proposal.client_name && (
                <span>Prepared for {proposal.client_name}</span>
              )}
              {proposal.client_name && proposal.client_company && (
                <span className="mx-1 text-[var(--text-tertiary)]">&middot;</span>
              )}
              {proposal.client_company && (
                <span>{proposal.client_company}</span>
              )}
            </p>
          )}
          {proposal.total_amount && (
            <p className="mt-3 font-mono text-lg text-[var(--accent)] sm:text-xl">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: (proposal.currency as string) ?? "USD",
                minimumFractionDigits: 0,
              }).format(parseFloat(proposal.total_amount as string))}
            </p>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-[var(--content-narrow)] px-[var(--content-padding-x)] py-8 sm:py-12">
          {content ? (
            <ProposalViewerClient content={content} />
          ) : (
            <p className="text-center text-[var(--text-secondary)]">
              This proposal has no content yet.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-[var(--content-narrow)] px-[var(--content-padding-x)] py-6">
          <p className="text-center text-xs text-[var(--text-tertiary)]">
            Powered by{" "}
            <a
              href="https://propsly.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
            >
              Propsly
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
