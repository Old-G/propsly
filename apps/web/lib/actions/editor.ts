"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveProposalContent(
  proposalId: string,
  content: Record<string, unknown> | undefined
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("proposals")
    .update({ content })
    .eq("id", proposalId)

  if (error) return { error: error.message }

  return { success: true }
}

export async function updateProposalSettings(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const clientName = formData.get("client_name") as string
  const clientEmail = formData.get("client_email") as string
  const clientCompany = formData.get("client_company") as string
  const currency = formData.get("currency") as string
  const totalAmount = formData.get("total_amount") as string
  const expiresAt = formData.get("expires_at") as string

  const { error } = await supabase
    .from("proposals")
    .update({
      title: title || undefined,
      slug: slug || undefined,
      client_name: clientName || null,
      client_email: clientEmail || null,
      client_company: clientCompany || null,
      currency: currency || "USD",
      total_amount: totalAmount || null,
      expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath(`/proposals/${id}`)
  return { success: true }
}
