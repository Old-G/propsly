import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NewProposalContent } from "@/components/proposals/new-proposal-content"

export const metadata = {
  title: "New Proposal",
}

export default async function NewProposalPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("default_workspace_id")
    .eq("id", user.id)
    .single()

  if (!profile?.default_workspace_id) redirect("/onboarding")

  // Get templates
  const { data: templates } = await supabase
    .from("templates")
    .select("id, name, description, category, is_system")
    .or(`workspace_id.eq.${profile.default_workspace_id},is_system.eq.true`)
    .order("is_system", { ascending: false })

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="text-2xl font-semibold mb-2">New Proposal</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        Choose a template or start from scratch
      </p>
      <NewProposalContent
        templates={templates ?? []}
        workspaceId={profile.default_workspace_id}
        userId={user.id}
      />
    </div>
  )
}
