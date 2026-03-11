import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"

export const metadata = {
  title: "Set Up Your Workspace",
}

export default async function OnboardingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user already has a workspace
  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", user.id)
    .limit(1)

  if (memberships && memberships.length > 0) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <p className="heading-display text-2xl italic mb-2">
          Propsly<span className="text-[var(--accent)]">.</span>
        </p>
        <h1 className="text-xl font-medium mb-8">Set up your workspace</h1>
        <OnboardingForm userId={user.id} userEmail={user.email ?? ""} userName={user.user_metadata?.full_name ?? ""} />
      </div>
    </div>
  )
}
