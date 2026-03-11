import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  // Check if user has a workspace
  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)

  if (!memberships || memberships.length === 0) {
    redirect("/onboarding")
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-[var(--text-secondary)]">
        Welcome to Propsly. Your proposals will appear here.
      </p>
    </div>
  )
}
