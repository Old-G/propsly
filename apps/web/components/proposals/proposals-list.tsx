"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback } from "react"
import { Plus, Search, MoreHorizontal, Copy, Trash2, ExternalLink, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { deleteProposal, duplicateProposal } from "@/lib/actions/proposals"
import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll"
import { useInfiniteList } from "@/lib/hooks/use-infinite-list"
import { fetchProposalsPage } from "@/lib/actions/infinite-proposals"

const STATUS_COLORS: Record<string, string> = {
  draft: "border-[var(--text-tertiary)]/30 text-[var(--text-tertiary)] bg-[var(--text-tertiary)]/10",
  sent: "border-[var(--info)]/30 text-[var(--info)] bg-[var(--info)]/10",
  viewed: "border-[var(--warning)]/30 text-[var(--warning)] bg-[var(--warning)]/10",
  signed: "border-[var(--success)]/30 text-[var(--success)] bg-[var(--success)]/10",
  expired: "border-[var(--error)]/30 text-[var(--error)] bg-[var(--error)]/10",
  declined: "border-[var(--error)]/30 text-[var(--error)] bg-[var(--error)]/10",
}

const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "sent", label: "Sent" },
  { value: "viewed", label: "Viewed" },
  { value: "signed", label: "Signed" },
]

function formatCurrency(amount: string | null, currency: string | null) {
  if (!amount) return "\u2014"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "USD",
    minimumFractionDigits: 0,
  }).format(parseFloat(amount))
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date))
}

function formatRelative(date: string | null) {
  if (!date) return "Never"
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return formatDate(date)
}

interface Proposal {
  id: string
  title: string
  slug: string
  client_name: string | null
  client_company: string | null
  status: string
  total_amount: string | null
  currency: string | null
  created_at: string
  viewed_at: string | null
}

interface ProposalsListProps {
  proposals: Proposal[]
  totalCount: number
  currentPage: number
  perPage: number
  filters: {
    status: string
    search: string
    sort: string
    order: string
  }
  workspaceId: string
}

export function ProposalsList({
  proposals,
  totalCount,
  currentPage,
  perPage,
  filters,
  workspaceId,
}: ProposalsListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState(filters.search)

  // Infinite scroll
  const fetchMore = useCallback(
    async (offset: number) => {
      const result = await fetchProposalsPage({
        workspaceId,
        offset,
        limit: perPage,
        status: filters.status === "all" ? undefined : filters.status,
        search: filters.search || undefined,
        sort: filters.sort,
        order: filters.order,
      })
      return { items: result.proposals, totalCount: result.totalCount }
    },
    [workspaceId, perPage, filters]
  )

  const { items: allProposals, loadMore, loadingMore, hasMore } = useInfiniteList({
    initialItems: proposals,
    totalCount,
    fetchMore,
  })

  const scrollRef = useInfiniteScroll(loadMore, hasMore, loadingMore)

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })
      params.delete("page")
      router.push(`/proposals?${params.toString()}`)
    },
    [router, searchParams]
  )

  const handleSearch = useCallback(() => {
    updateParams({ search: searchValue })
  }, [searchValue, updateParams])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Proposals</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage all your proposals
          </p>
        </div>
        <Button onClick={() => router.push("/proposals/new")}>
          <Plus className="h-4 w-4" />
          New Proposal
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 overflow-x-auto scrollbar-none">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => updateParams({ status: tab.value === "all" ? "" : tab.value })}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm whitespace-nowrap transition-colors",
                filters.status === tab.value || (tab.value === "all" && filters.status === "all")
                  ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <Input
            placeholder="Search proposals..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 w-64"
          />
        </div>
      </div>

      {/* Empty state */}
      {allProposals.length === 0 && totalCount === 0 && !filters.search && filters.status === "all" ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-muted)]">
            <FileText className="h-8 w-8 text-[var(--accent)]" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">Create your first proposal</h2>
          <p className="mt-2 text-center text-sm text-[var(--text-secondary)] max-w-md">
            Start building beautiful, interactive proposals that win more deals.
          </p>
          <Button className="mt-6" onClick={() => router.push("/proposals/new")}>
            <Plus className="h-4 w-4" />
            New Proposal
          </Button>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="rounded-xl border border-[var(--border-default)] overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer hover:text-[var(--text-primary)]"
                    onClick={() =>
                      updateParams({
                        sort: "title",
                        order: filters.sort === "title" && filters.order === "asc" ? "desc" : "asc",
                      })
                    }
                  >
                    Title
                  </TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-[var(--text-primary)]"
                    onClick={() =>
                      updateParams({
                        sort: "total_amount",
                        order: filters.sort === "total_amount" && filters.order === "desc" ? "asc" : "desc",
                      })
                    }
                  >
                    Amount
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-[var(--text-primary)]"
                    onClick={() =>
                      updateParams({
                        sort: "created_at",
                        order: filters.sort === "created_at" && filters.order === "desc" ? "asc" : "desc",
                      })
                    }
                  >
                    Created
                  </TableHead>
                  <TableHead>Last Viewed</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {allProposals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-[var(--text-secondary)]">
                      No proposals found
                    </TableCell>
                  </TableRow>
                ) : (
                  allProposals.map((proposal) => (
                    <TableRow
                      key={proposal.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/proposals/${proposal.id}`)}
                    >
                      <TableCell className="font-medium">{proposal.title}</TableCell>
                      <TableCell className="text-[var(--text-secondary)]">
                        {proposal.client_name || proposal.client_company || "\u2014"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("capitalize", STATUS_COLORS[proposal.status])}
                        >
                          {proposal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(proposal.total_amount, proposal.currency)}</TableCell>
                      <TableCell className="text-[var(--text-secondary)]">
                        {formatDate(proposal.created_at)}
                      </TableCell>
                      <TableCell className="text-[var(--text-secondary)]">
                        {formatRelative(proposal.viewed_at)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open(`/p/${proposal.slug}`, "_blank")
                              }}
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async (e) => {
                                e.stopPropagation()
                                await duplicateProposal(proposal.id)
                              }}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={async (e) => {
                                e.stopPropagation()
                                if (confirm("Delete this proposal?")) {
                                  await deleteProposal(proposal.id)
                                }
                              }}
                              className="text-[var(--error)]"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={scrollRef} className="h-1" />
          {loadingMore && (
            <div className="py-4 text-center text-sm text-[var(--text-secondary)]">
              Loading more...
            </div>
          )}

          {/* Count indicator */}
          {allProposals.length > 0 && (
            <p className="text-sm text-[var(--text-secondary)]">
              Showing {allProposals.length} of {totalCount}
            </p>
          )}
        </>
      )}
    </div>
  )
}
