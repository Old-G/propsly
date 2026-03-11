"use server"

import { createClient } from "@/lib/supabase/server"
import { sanitizePostgrestQuery } from "@/lib/utils"

export async function fetchProposalsPage(input: {
  workspaceId: string
  offset: number
  limit: number
  status?: string
  search?: string
  sort?: string
  order?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from("proposals")
    .select("*", { count: "exact" })
    .eq("workspace_id", input.workspaceId)
    .order(input.sort ?? "created_at", { ascending: input.order === "asc" })
    .range(input.offset, input.offset + input.limit - 1)

  if (input.status && input.status !== "all") {
    query = query.eq("status", input.status)
  }

  if (input.search) {
    const s = sanitizePostgrestQuery(input.search)
    query = query.or(
      `title.ilike.%${s}%,client_name.ilike.%${s}%,client_company.ilike.%${s}%`
    )
  }

  const { data, count, error } = await query

  if (error) return { proposals: [], totalCount: 0, error: error.message }

  return { proposals: data ?? [], totalCount: count ?? 0 }
}

export async function fetchContactsPage(input: {
  workspaceId: string
  offset: number
  limit: number
}) {
  const supabase = await createClient()

  const { data, count, error } = await supabase
    .from("contacts")
    .select("*", { count: "exact" })
    .eq("workspace_id", input.workspaceId)
    .order("created_at", { ascending: false })
    .range(input.offset, input.offset + input.limit - 1)

  if (error) return { contacts: [], totalCount: 0, error: error.message }

  return { contacts: data ?? [], totalCount: count ?? 0 }
}
