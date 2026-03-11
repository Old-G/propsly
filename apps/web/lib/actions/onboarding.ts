"use server"

import { createClient } from "@/lib/supabase/server"

interface CreateWorkspaceInput {
  userId: string
  name: string
  logoUrl?: string
  brandPrimaryColor?: string
  brandSecondaryColor?: string
  industry?: string
}

export async function createWorkspace(input: CreateWorkspaceInput) {
  const supabase = await createClient()

  // Verify the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== input.userId) {
    return { error: "Unauthorized" }
  }

  // Create workspace + owner + update profile atomically via RPC
  const { data: workspaceId, error } = await supabase.rpc(
    "create_workspace_with_owner",
    {
      p_user_id: user.id,
      p_name: input.name,
      p_logo_url: input.logoUrl ?? null,
      p_brand_primary_color: input.brandPrimaryColor ?? null,
      p_brand_secondary_color: input.brandSecondaryColor ?? null,
      p_industry: input.industry ?? null,
    }
  )

  if (error) {
    return { error: error.message }
  }

  return { success: true, workspaceId }
}
