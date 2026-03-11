import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user belongs to workspace that owns this proposal
    const { data: proposal } = await supabase
      .from("proposals")
      .select("id, status, workspace_id")
      .eq("id", id)
      .single()

    if (proposal) {
      const { data: member } = await supabase
        .from("workspace_members")
        .select("id")
        .eq("workspace_id", proposal.workspace_id)
        .eq("user_id", user.id)
        .single()

      if (!member) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }

    if (!proposal) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // Only update if currently draft
    if (proposal.status === "draft") {
      await supabase
        .from("proposals")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
        })
        .eq("id", id)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
