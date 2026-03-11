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

  // Create workspace
  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .insert({
      name: input.name,
      logo_url: input.logoUrl,
      brand_primary_color: input.brandPrimaryColor,
      brand_secondary_color: input.brandSecondaryColor,
      industry: input.industry,
    })
    .select("id")
    .single()

  if (workspaceError || !workspace) {
    return { error: workspaceError?.message ?? "Failed to create workspace" }
  }

  // Add user as owner
  const { error: memberError } = await supabase
    .from("workspace_members")
    .insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: "owner",
      joined_at: new Date().toISOString(),
    })

  if (memberError) {
    return { error: memberError.message }
  }

  // Update profile with default workspace
  await supabase
    .from("profiles")
    .update({ default_workspace_id: workspace.id })
    .eq("id", user.id)

  return { success: true, workspaceId: workspace.id }
}
