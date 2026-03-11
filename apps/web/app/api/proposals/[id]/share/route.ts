import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"
import { z } from "zod"
import { buildProposalSharedEmail } from "@/lib/email/proposal-shared"

const shareSchema = z.object({
  email: z.string().email("Invalid email address"),
  message: z.string().max(2000).optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Authenticate user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate body
    const body = await request.json()
    const parsed = shareSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { email, message } = parsed.data

    // Fetch proposal
    const { data: proposal, error: proposalError } = await supabase
      .from("proposals")
      .select("id, title, slug, status, workspace_id")
      .eq("id", id)
      .single()

    if (proposalError || !proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      )
    }

    // Validate workspace membership
    const { data: membership } = await supabase
      .from("workspace_members")
      .select("id")
      .eq("workspace_id", proposal.workspace_id)
      .eq("user_id", user.id)
      .single()

    if (!membership) {
      return NextResponse.json(
        { error: "You do not have access to this proposal" },
        { status: 403 }
      )
    }

    // Get sender profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single()

    // Get workspace name for sender company
    const { data: workspace } = await supabase
      .from("workspaces")
      .select("name")
      .eq("id", proposal.workspace_id)
      .single()

    const senderName = profile?.full_name ?? user.email ?? "Someone"

    // Send email via Resend
    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      )
    }

    const resend = new Resend(resendKey)
    const html = buildProposalSharedEmail({
      proposalTitle: proposal.title,
      senderName,
      senderCompany: workspace?.name,
      message,
      proposalSlug: proposal.slug,
    })

    const { error: emailError } = await resend.emails.send({
      from: "Propsly <hello@propsly.org>",
      to: email,
      subject: `${senderName} sent you a proposal: ${proposal.title}`,
      html,
    })

    if (emailError) {
      console.error("Failed to send email:", emailError)
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      )
    }

    // On first share: update status from draft -> sent
    if (proposal.status === "draft") {
      await supabase
        .from("proposals")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
        })
        .eq("id", proposal.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Share proposal error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}
