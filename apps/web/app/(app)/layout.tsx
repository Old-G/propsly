import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentUser, getUserProfile, getUserWorkspace } from "@/lib/queries"
import { AppSidebar } from "@/components/app/sidebar"
import { AppHeader } from "@/components/app/header"
import { getNotifications } from "@/lib/actions/notifications"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const profile = await getUserProfile()
  if (!profile?.default_workspace_id) {
    redirect("/onboarding")
  }

  // Fetch workspace, unread count, notifications, and proposal count in parallel
  const supabase = await createClient()
  const [workspace, { count: unreadCount }, notifications, { count: proposalCount }] = await Promise.all([
    getUserWorkspace(),
    supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("read", false),
    getNotifications(),
    supabase
      .from("proposals")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", profile.default_workspace_id),
  ])

  if (!workspace) {
    redirect("/onboarding")
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar workspace={workspace} proposalCount={proposalCount ?? 0} />
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
          proposalCount={proposalCount ?? 0}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
