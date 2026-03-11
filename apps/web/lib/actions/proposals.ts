"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deleteProposal(proposalId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("proposals")
    .delete()
    .eq("id", proposalId)

  if (error) return { error: error.message }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function duplicateProposal(proposalId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  // Get original
  const { data: original, error: fetchError } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", proposalId)
    .single()

  if (fetchError || !original) return { error: "Proposal not found" }

  // Create duplicate
  const { error: insertError } = await supabase.from("proposals").insert({
    workspace_id: original.workspace_id,
    created_by: user.id,
    title: `${original.title} (copy)`,
    slug: `${original.slug}-copy-${Date.now()}`,
    content: original.content,
    client_name: original.client_name,
    client_email: original.client_email,
    client_company: original.client_company,
    contact_id: original.contact_id,
    status: "draft",
    currency: original.currency,
    total_amount: original.total_amount,
  })

  if (insertError) return { error: insertError.message }

  revalidatePath("/dashboard")
  return { success: true }
}

export async function createProposalFromTemplate(input: {
  workspaceId: string
  userId: string
  templateId?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== input.userId) return { error: "Unauthorized" }

  let content = { type: "doc", content: [{ type: "paragraph" }] }

  if (input.templateId) {
    const { data: template } = await supabase
      .from("templates")
      .select("content")
      .eq("id", input.templateId)
      .single()

    if (template?.content) {
      content = template.content as typeof content
    }
  }

  const slug = `proposal-${Date.now()}`
  const { data: proposal, error } = await supabase
    .from("proposals")
    .insert({
      workspace_id: input.workspaceId,
      created_by: user.id,
      title: "Untitled Proposal",
      slug,
      content,
      status: "draft",
    })
    .select("id")
    .single()

  if (error) return { error: error.message }

  revalidatePath("/dashboard")
  return { success: true, proposalId: proposal?.id }
}
