import { createClient } from "@/lib/supabase/server"
import { FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

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

  const { data: templates } = await supabase
    .from("templates")
    .select("*")
    .or(`workspace_id.eq.${profile!.default_workspace_id},is_system.eq.true`)
    .order("is_system", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Templates</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Reusable templates for your proposals
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates?.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-elevated)]">
                  <FileText className="h-5 w-5 text-[var(--text-secondary)]" />
                </div>
                <div className="flex gap-2">
                  {template.is_system && (
                    <Badge variant="outline" className="text-xs">System</Badge>
                  )}
                  {template.category && (
                    <Badge variant="secondary" className="text-xs capitalize">
                      {template.category}
                    </Badge>
                  )}
                </div>
              </div>
              <p className="mt-3 font-medium">{template.name}</p>
              {template.description && (
                <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
                  {template.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {(!templates || templates.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16">
          <FileText className="h-12 w-12 text-[var(--text-tertiary)]" />
          <p className="mt-4 text-[var(--text-secondary)]">No templates yet</p>
        </div>
      )}
    </div>
  )
}
