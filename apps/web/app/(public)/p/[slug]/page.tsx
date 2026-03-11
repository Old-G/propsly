import { notFound } from "next/navigation"
import { cookies, headers } from "next/headers"
import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ProposalViewerClient } from "./proposal-viewer-client"
import { PasswordGate } from "./password-gate"

interface ContentNode {
  type: string
  content?: ContentNode[]
  attrs?: Record<string, unknown>
}

interface SignatureInfo {
  signedBy: string
  signedAt: string
  signatureData: string
  signatureType: "typed" | "drawn" | "none"
}

interface WorkspaceBranding {
  name: string
  logoUrl: string | null
  brandPrimaryColor: string | null
  companyWebsite: string | null
}

function findSignatureBlock(node: ContentNode): SignatureInfo | null {
  if (node.type === "signatureBlock" && node.attrs) {
    return {
      signedBy: (node.attrs.signedBy as string) ?? "",
      signedAt: (node.attrs.signedAt as string) ?? "",
      signatureData: (node.attrs.signatureData as string) ?? "",
      signatureType: (node.attrs.signatureType as "typed" | "drawn" | "none") ?? "none",
    }
  }
  if (node.content && Array.isArray(node.content)) {
    for (const child of node.content) {
      const found = findSignatureBlock(child)
      if (found) return found
    }
  }
  return null
}

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ pdf?: string }>
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

async function getWorkspaceBranding(workspaceId: string): Promise<WorkspaceBranding | null> {
  const supabase = await createClient()

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("name, logo_url, brand_primary_color, company_website")
    .eq("id", workspaceId)
    .single()

  if (!workspace) return null

  return {
    name: workspace.name,
    logoUrl: workspace.logo_url as string | null,
    brandPrimaryColor: workspace.brand_primary_color as string | null,
    companyWebsite: workspace.company_website as string | null,
  }
}

function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

export default async function ProposalViewPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { pdf } = await searchParams
  const isPdfMode = pdf === "true"
  const supabase = await createClient()

  const { data: proposal } = await supabase
    .from("proposals")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!proposal) {
    notFound()
  }

  // Draft proposals are not publicly viewable (skip check in PDF mode for internal rendering)
  if (proposal.status === "draft" && !isPdfMode) {
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

  // --- Expiration Check ---
  if (isExpired(proposal.expires_at as string | null)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mb-6">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-[var(--warning)]"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h1 className="heading-display text-xl text-[var(--text-primary)] sm:text-2xl">
          This proposal has expired
        </h1>
        <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
          This proposal is no longer available. Please contact the sender for an updated version.
        </p>
        {proposal.client_email && (
          <p className="mt-4 text-xs text-[var(--text-tertiary)]">
            Proposal: {proposal.title}
          </p>
        )}
      </div>
    )
  }

  // --- Password Protection (skip in PDF mode) ---
  const hasPassword = Boolean(proposal.password_hash)
  if (hasPassword && !isPdfMode) {
    const cookieStore = await cookies()
    const accessCookie = cookieStore.get(`proposal_access_${slug}`)
    if (!accessCookie?.value) {
      return (
        <PasswordGate
          proposalId={proposal.id}
          slug={slug}
          proposalTitle={proposal.title}
        />
      )
    }
  }

  // Record the view (fire and forget — don't block rendering, skip in PDF mode)
  if (!isPdfMode) {
    recordView(proposal.id).catch(() => {
      // Silently ignore view tracking errors
    })
  }

  // --- Workspace Branding ---
  const workspace = await getWorkspaceBranding(proposal.workspace_id as string)
  const brandColor = workspace?.brandPrimaryColor ?? null

  const content = proposal.content as Record<string, unknown> | null

  // Extract signature block info from content
  const signatureInfo = content
    ? findSignatureBlock(content as unknown as ContentNode)
    : null

  // Build variables for content variable resolution
  const totalAmount = proposal.total_amount
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: (proposal.currency as string) ?? "USD",
        minimumFractionDigits: 0,
      }).format(parseFloat(proposal.total_amount as string))
    : ""

  const variables: Record<string, string> = {
    client_name: (proposal.client_name as string) ?? "",
    client_company: (proposal.client_company as string) ?? "",
    project_name: (proposal.title as string) ?? "",
    date: new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date()),
    total: totalAmount,
  }

  // Build custom properties for workspace branding
  const brandStyles = brandColor
    ? ({
        "--brand-accent": brandColor,
        "--brand-accent-hover": brandColor,
        "--brand-accent-muted": `${brandColor}20`,
        "--brand-accent-border": `${brandColor}40`,
        "--brand-accent-glow": `${brandColor}15`,
      } as React.CSSProperties)
    : {}

  return (
    <div
      className={`proposal-viewer flex min-h-screen flex-col ${isPdfMode ? "pdf-mode" : ""}`}
      style={brandStyles}
    >
      {/* Header */}
      <header className="border-b border-[var(--border-default)] bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-[var(--viewer-max-width,800px)] px-[var(--content-padding-x)] py-6 sm:py-8">
          {/* Workspace branding */}
          {workspace && (
            <div className="mb-4 flex items-center gap-3 sm:mb-6">
              {workspace.logoUrl ? (
                <img
                  src={workspace.logoUrl}
                  alt={workspace.name}
                  className="h-8 w-8 rounded-md object-contain sm:h-10 sm:w-10"
                />
              ) : (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-md text-sm font-semibold text-[var(--text-inverse)] sm:h-10 sm:w-10 sm:text-base"
                  style={{
                    backgroundColor: brandColor ?? "var(--accent)",
                  }}
                >
                  {workspace.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)] sm:text-base">
                  {workspace.name}
                </p>
                {workspace.companyWebsite && (
                  <a
                    href={workspace.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[var(--text-tertiary)] transition-colors hover:text-[var(--text-secondary)]"
                  >
                    {workspace.companyWebsite.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>
          )}

          <h1 className="heading-display text-2xl leading-tight sm:text-3xl lg:text-4xl">
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
            <p
              className="mt-3 font-mono text-lg sm:text-xl"
              style={{ color: brandColor ?? "var(--accent)" }}
            >
              {totalAmount}
            </p>
          )}

          {/* Expiration notice (if expires_at is set but not expired yet) */}
          {proposal.expires_at && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Valid until{" "}
              {new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }).format(new Date(proposal.expires_at as string))}
            </p>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-[var(--viewer-max-width,800px)] px-[var(--content-padding-x)] py-6 sm:py-8 md:py-12">
          {content ? (
            <ProposalViewerClient
              content={content}
              variables={variables}
              proposalId={proposal.id}
              proposalStatus={proposal.status as string}
              signatureInfo={signatureInfo}
              isPdfMode={isPdfMode}
            />
          ) : (
            <p className="text-center text-[var(--text-secondary)]">
              This proposal has no content yet.
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] bg-[var(--bg-primary)]">
        <div className="mx-auto max-w-[var(--viewer-max-width,800px)] px-[var(--content-padding-x)] py-6">
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
