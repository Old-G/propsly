import { cache } from "react"
import { createClient } from "@/lib/supabase/server"

/**
 * Cached: get the current authenticated user.
 * Deduplicated across all server components in the same request.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
})

/**
 * Cached: get the current user's profile (including default_workspace_id).
 * Deduplicated across all server components in the same request.
 */
export const getUserProfile = cache(async () => {
  const user = await getCurrentUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, default_workspace_id")
    .eq("id", user.id)
    .single()

  return profile
})

/**
 * Cached: get the current user's default workspace.
 * Deduplicated across all server components in the same request.
 */
export const getUserWorkspace = cache(async () => {
  const profile = await getUserProfile()
  if (!profile?.default_workspace_id) return null

  const supabase = await createClient()
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name, logo_url")
    .eq("id", profile.default_workspace_id)
    .single()

  return workspace
})
