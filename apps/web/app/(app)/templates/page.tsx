import { createClient } from "@/lib/supabase/server"
import { TemplatesGallery } from "@/components/templates/templates-gallery"
import { seedSystemTemplates } from "@/lib/actions/templates"

export const metadata = {
  title: "Templates",
}

export default async function TemplatesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("default_workspace_id")
    .eq("id", user!.id)
    .single()

  const workspaceId = profile!.default_workspace_id!

  // Auto-seed system templates if none exist
  const { count: systemCount } = await supabase
    .from("templates")
    .select("*", { count: "exact", head: true })
    .eq("is_system", true)

  if (!systemCount || systemCount < 10) {
    await seedSystemTemplates()
  }

  const { data: templates } = await supabase
    .from("templates")
    .select("*")
    .or(`workspace_id.eq.${workspaceId},is_system.eq.true`)
    .order("is_system", { ascending: false })
    .order("created_at", { ascending: false })

  // Get unique categories
  const categories = Array.from(
    new Set((templates ?? []).map((t) => t.category).filter(Boolean))
  ) as string[]

  return (
    <TemplatesGallery
      templates={templates ?? []}
      categories={categories}
      workspaceId={workspaceId}
      userId={user!.id}
    />
  )
}
