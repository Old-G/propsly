import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/queries"
import { sanitizePostgrestQuery } from "@/lib/utils"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export const metadata = {
  title: "Dashboard",
}

interface DashboardPageProps {
  searchParams: Promise<{
    status?: string
    search?: string
    sort?: string
    order?: string
    page?: string
    period?: string
  }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams
  const profile = await getUserProfile()
  const workspaceId = profile!.default_workspace_id!
  const supabase = await createClient()

  // Build query
  const page = parseInt(params.page ?? "1")
  const perPage = 20
  const offset = (page - 1) * perPage
  const sortField = params.sort ?? "created_at"
  const sortOrder = params.order === "asc"

  let query = supabase
    .from("proposals")
    .select("*", { count: "exact" })
    .eq("workspace_id", workspaceId)
    .order(sortField, { ascending: sortOrder })
    .range(offset, offset + perPage - 1)

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status)
  }

  if (params.search) {
    const s = sanitizePostgrestQuery(params.search)
    query = query.or(
      `title.ilike.%${s}%,client_name.ilike.%${s}%,client_company.ilike.%${s}%`
    )
  }

  // Fetch paginated proposals and stats in parallel (both only need workspaceId)
  const [{ data: proposals, count }, { data: allProposals }] = await Promise.all([
    query,
    supabase
      .from("proposals")
      .select("status, total_amount")
      .eq("workspace_id", workspaceId),
  ])

  const stats = {
    total: allProposals?.length ?? 0,
    draft: allProposals?.filter((p) => p.status === "draft").length ?? 0,
    sent: allProposals?.filter((p) => p.status === "sent").length ?? 0,
    viewed: allProposals?.filter((p) => p.status === "viewed").length ?? 0,
    signed: allProposals?.filter((p) => p.status === "signed").length ?? 0,
    expired: allProposals?.filter((p) => p.status === "expired").length ?? 0,
    declined: allProposals?.filter((p) => p.status === "declined").length ?? 0,
    pipelineValue:
      allProposals
        ?.filter((p) => ["sent", "viewed"].includes(p.status))
        .reduce((sum, p) => sum + (parseFloat(p.total_amount) || 0), 0) ?? 0,
    wonValue:
      allProposals
        ?.filter((p) => p.status === "signed")
        .reduce((sum, p) => sum + (parseFloat(p.total_amount) || 0), 0) ?? 0,
  }

  const winRate =
    stats.total > 0
      ? Math.round((stats.signed / (stats.signed + stats.declined + stats.expired)) * 100) || 0
      : 0

  return (
    <DashboardContent
      proposals={proposals ?? []}
      totalCount={count ?? 0}
      stats={{ ...stats, winRate }}
      currentPage={page}
      perPage={perPage}
      filters={{
        status: params.status ?? "all",
        search: params.search ?? "",
        sort: sortField,
        order: params.order ?? "desc",
      }}
      workspaceId={workspaceId}
    />
  )
}
