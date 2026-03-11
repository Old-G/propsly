import { createClient } from "@/lib/supabase/server"
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
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user's workspace
  const { data: profile } = await supabase
    .from("profiles")
    .select("default_workspace_id")
    .eq("id", user!.id)
    .single()

  const workspaceId = profile!.default_workspace_id!

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
    query = query.or(
      `title.ilike.%${params.search}%,client_name.ilike.%${params.search}%,client_company.ilike.%${params.search}%`
    )
  }

  const { data: proposals, count } = await query

  // Stats - get counts by status for the workspace
  const { data: allProposals } = await supabase
    .from("proposals")
    .select("status, total_amount")
    .eq("workspace_id", workspaceId)

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
