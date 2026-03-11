"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveAsTemplate(input: {
  proposalId: string
  name: string
  description?: string
  category?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Get proposal content
  const { data: proposal } = await supabase
    .from("proposals")
    .select("content, workspace_id")
    .eq("id", input.proposalId)
    .single()

  if (!proposal) return { error: "Proposal not found" }

  const { error } = await supabase.from("templates").insert({
    workspace_id: proposal.workspace_id,
    name: input.name,
    description: input.description ?? null,
    category: input.category ?? null,
    content: proposal.content,
    is_system: false,
  })

  if (error) return { error: error.message }

  revalidatePath("/templates")
  return { success: true }
}

export async function deleteTemplate(templateId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("templates")
    .delete()
    .eq("id", templateId)
    .eq("is_system", false) // Can't delete system templates

  if (error) return { error: error.message }

  revalidatePath("/templates")
  return { success: true }
}

export async function seedSystemTemplates() {
  const supabase = await createClient()

  // Check if system templates already exist
  const { count } = await supabase
    .from("templates")
    .select("*", { count: "exact", head: true })
    .eq("is_system", true)

  if (count && count >= 10) return { success: true, message: "Already seeded" }

  const { SYSTEM_TEMPLATES } = await import("@/lib/templates/system-templates")

  for (const template of SYSTEM_TEMPLATES) {
    await supabase.from("templates").insert({
      workspace_id: null,
      name: template.name,
      description: template.description,
      category: template.category,
      content: template.content,
      is_system: true,
    })
  }

  revalidatePath("/templates")
  return { success: true }
}
