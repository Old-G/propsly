import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WorkspaceForm } from "@/components/settings/workspace-form"

export const metadata = {
  title: "Workspace Settings",
}

export default async function WorkspaceSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Get user's profile to find default workspace
  const { data: profile } = await supabase
    .from("profiles")
    .select("default_workspace_id")
    .eq("id", user.id)
    .single()

  if (!profile?.default_workspace_id) {
    redirect("/onboarding")
  }

  // Get workspace details
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", profile.default_workspace_id)
    .single()

  if (!workspace) {
    redirect("/onboarding")
  }

  // Get user's role
  const { data: member } = await supabase
    .from("workspace_members")
    .select("role")
    .eq("workspace_id", workspace.id)
    .eq("user_id", user.id)
    .single()

  const isAdmin = member?.role === "owner" || member?.role === "admin"

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold mb-1">Workspace</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        Manage your workspace settings
      </p>
      <WorkspaceForm
        workspace={{
          id: workspace.id,
          name: workspace.name,
          logoUrl: workspace.logo_url ?? "",
          brandPrimaryColor: workspace.brand_primary_color ?? "#34d399",
          brandSecondaryColor: workspace.brand_secondary_color ?? "#0a0a0a",
          companyWebsite: workspace.company_website ?? "",
          companyPhone: workspace.company_phone ?? "",
          companyAddress: workspace.company_address ?? "",
          industry: workspace.industry ?? "",
        }}
        isAdmin={isAdmin}
      />
    </div>
  )
}
