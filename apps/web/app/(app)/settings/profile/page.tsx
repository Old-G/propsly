import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/settings/profile-form"

export const metadata = {
  title: "Profile Settings",
}

export default async function ProfileSettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold mb-1">Profile</h1>
      <p className="text-sm text-[var(--text-secondary)] mb-8">
        Manage your personal information
      </p>
      <ProfileForm
        profile={{
          email: user.email ?? "",
          fullName: profile?.full_name ?? "",
          avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? "",
        }}
      />
    </div>
  )
}
