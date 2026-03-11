"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function submitUpgradeRequest(input: {
  workspaceId: string
  requestedPlan: "pro" | "team"
  email?: string
  message?: string
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Unauthorized" }
  }

  // Check membership
  const { data: member } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", input.workspaceId)
    .eq("user_id", user.id)
    .single()

  if (!member) {
    return { error: "Forbidden" }
  }

  const { error } = await supabase.from("upgrade_requests").insert({
    workspace_id: input.workspaceId,
    user_id: user.id,
    requested_plan: input.requestedPlan,
    email: input.email || user.email,
    message: input.message || null,
  })

  if (error) {
    return { error: "Failed to submit request" }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function getProposalCount(workspaceId: string) {
  const supabase = await createClient()

  const { count } = await supabase
    .from("proposals")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId)

  return count ?? 0
}
