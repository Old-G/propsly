import { createClient } from "@/lib/supabase/server"
import { ProposalsList } from "@/components/proposals/proposals-list"

export const metadata = {
  title: "Proposals",
}

interface ProposalsPageProps {
  searchParams: Promise<{
    status?: string
    search?: string
    sort?: string
    order?: string
    page?: string
  }>
}

export default async function ProposalsPage({ searchParams }: ProposalsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("default_workspace_id")
    .eq("id", user!.id)
    .single()

  const workspaceId = profile!.default_workspace_id!

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

  return (
    <ProposalsList
      proposals={proposals ?? []}
      totalCount={count ?? 0}
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
