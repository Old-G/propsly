import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AppSidebar } from "@/components/app/sidebar"
import { AppHeader } from "@/components/app/header"
import { getNotifications } from "@/lib/actions/notifications"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Get profile with default workspace
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, default_workspace_id")
    .eq("id", user.id)
    .single()

  if (!profile?.default_workspace_id) {
    redirect("/onboarding")
  }

  // Get workspace
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("id, name, logo_url")
    .eq("id", profile.default_workspace_id)
    .single()

  if (!workspace) {
    redirect("/onboarding")
  }

  // Get unread notification count
  const { count: unreadCount } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false)

  // Get recent notifications for dropdown
  const notifications = await getNotifications()

  return (
    <div className="flex min-h-screen">
      <AppSidebar workspace={workspace} />
      <div className="flex flex-1 flex-col">
        <AppHeader
          user={{
            email: user.email ?? "",
            fullName: profile.full_name ?? "",
            avatarUrl: profile.avatar_url ?? user.user_metadata?.avatar_url ?? "",
          }}
          workspace={workspace}
          unreadCount={unreadCount ?? 0}
          notifications={notifications}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
