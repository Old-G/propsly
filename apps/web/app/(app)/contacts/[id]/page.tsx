import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Building2, Phone, FileText, StickyNote } from "lucide-react"
import { getContactWithProposals } from "@/lib/actions/contacts"
import { Badge } from "@/components/ui/badge"

const statusColors: Record<string, string> = {
  draft: "bg-[var(--bg-surface)] text-[var(--text-secondary)]",
  sent: "bg-blue-500/10 text-blue-400",
  viewed: "bg-amber-500/10 text-amber-400",
  signed: "bg-emerald-500/10 text-emerald-400",
  expired: "bg-red-500/10 text-red-400",
  declined: "bg-red-500/10 text-red-400",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ContactDetailPage({ params }: PageProps) {
  const { id } = await params
  const result = await getContactWithProposals(id)

  if (result.error || !result.contact) {
    notFound()
  }

  const { contact, proposals } = result

  const totalValue = (proposals ?? []).reduce((sum, p) => {
    return sum + (p.total_amount ? parseFloat(p.total_amount) : 0)
  }, 0)

  return (
    <div className="p-6 space-y-8 max-w-3xl">
      {/* Back */}
      <Link
        href="/contacts"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Contacts
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">{contact.name}</h1>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
          {contact.email && (
            <a
              href={`mailto:${contact.email}`}
              className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors"
            >
              <Mail className="h-4 w-4" />
              {contact.email}
            </a>
          )}
          {contact.company && (
            <span className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              {contact.company}
            </span>
          )}
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors"
            >
              <Phone className="h-4 w-4" />
              {contact.phone}
            </a>
          )}
        </div>
        {contact.notes && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-secondary)]">
            <StickyNote className="h-4 w-4 mt-0.5 flex-shrink-0 text-[var(--text-tertiary)]" />
            {contact.notes}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Proposals</p>
          <p className="mt-1 text-2xl font-semibold">{proposals?.length ?? 0}</p>
        </div>
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
          <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider">Total Value</p>
          <p className="mt-1 text-2xl font-semibold font-mono">
            {totalValue > 0
              ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(totalValue)
              : "$0"}
          </p>
        </div>
      </div>

      {/* Linked Proposals */}
      <div>
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Linked Proposals
        </h2>

        {!proposals || proposals.length === 0 ? (
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-8 text-center">
            <FileText className="mx-auto h-10 w-10 text-[var(--text-tertiary)]" />
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              No proposals linked to this contact yet
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-[var(--border-default)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-default)]">
                  <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--text-secondary)]">Amount</th>
                  <th className="px-4 py-3 text-right font-medium text-[var(--text-secondary)]">Created</th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-[var(--border-default)] last:border-0 hover:bg-[var(--bg-surface-hover)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/proposals/${p.id}`}
                        className="font-medium hover:text-[var(--accent)] transition-colors"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="secondary"
                        className={statusColors[p.status] ?? statusColors.draft}
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[var(--text-secondary)]">
                      {p.total_amount
                        ? new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: p.currency ?? "USD",
                            minimumFractionDigits: 0,
                          }).format(parseFloat(p.total_amount))
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--text-tertiary)]">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(p.created_at))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
