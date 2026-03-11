import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Check if user has a workspace
        const { data: memberships } = await supabase
          .from("workspace_members")
          .select("workspace_id")
          .eq("user_id", user.id)
          .limit(1)

        if (!memberships || memberships.length === 0) {
          // New user — redirect to onboarding
          return NextResponse.redirect(`${origin}/onboarding`)
        }

        // Existing user with workspace — go to dashboard
        return NextResponse.redirect(`${origin}/dashboard`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
