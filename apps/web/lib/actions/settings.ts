"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const fullName = formData.get("full_name") as string
  const avatarUrl = formData.get("avatar_url") as string

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName || null,
      avatar_url: avatarUrl || null,
    })
    .eq("id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/settings/profile")
  return { success: true }
}

export async function updateWorkspace(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const workspaceId = formData.get("workspace_id") as string
  const name = formData.get("name") as string
  const logoUrl = formData.get("logo_url") as string
  const brandPrimaryColor = formData.get("brand_primary_color") as string
  const brandSecondaryColor = formData.get("brand_secondary_color") as string
  const companyWebsite = formData.get("company_website") as string
  const companyPhone = formData.get("company_phone") as string
  const companyAddress = formData.get("company_address") as string
  const industry = formData.get("industry") as string

  // Verify user is owner or admin
  const { data: member } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspaceId)
    .eq("user_id", user.id)
    .single()

  if (!member || !["owner", "admin"].includes(member.role)) {
    return { error: "Insufficient permissions" }
  }

  const { error } = await supabase
    .from("workspaces")
    .update({
      name: name || undefined,
      logo_url: logoUrl || null,
      brand_primary_color: brandPrimaryColor || null,
      brand_secondary_color: brandSecondaryColor || null,
      company_website: companyWebsite || null,
      company_phone: companyPhone || null,
      company_address: companyAddress || null,
      industry: industry || null,
    })
    .eq("id", workspaceId)

  if (error) return { error: error.message }

  revalidatePath("/settings/workspace")
  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}
