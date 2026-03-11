import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface SignRequestBody {
  name: string
  signatureType: "typed" | "drawn"
  signatureData?: string
}

interface ProposalContent {
  type: string
  content?: ProposalContent[]
  attrs?: Record<string, unknown>
}

function updateSignatureBlockInContent(
  content: ProposalContent,
  signedBy: string,
  signedAt: string,
  signatureType: "typed" | "drawn",
  signatureData: string
): ProposalContent {
  if (content.type === "signatureBlock") {
    return {
      ...content,
      attrs: {
        ...content.attrs,
        signedBy,
        signedAt,
        signatureType,
        signatureData,
      },
    }
  }

  if (content.content && Array.isArray(content.content)) {
    return {
      ...content,
      content: content.content.map((child) =>
        updateSignatureBlockInContent(
          child,
          signedBy,
          signedAt,
          signatureType,
          signatureData
        )
      ),
    }
  }

  return content
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: proposalId } = await params
    const body = (await request.json()) as SignRequestBody

    // Validate request body
    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    if (body.signatureType !== "typed" && body.signatureType !== "drawn") {
      return NextResponse.json(
        { error: "Invalid signature type" },
        { status: 400 }
      )
    }

    if (body.signatureType === "drawn" && !body.signatureData) {
      return NextResponse.json(
        { error: "Signature data is required for drawn signatures" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Fetch the proposal
    const { data: proposal, error: fetchError } = await supabase
      .from("proposals")
      .select("id, status, content")
      .eq("id", proposalId)
      .single()

    if (fetchError || !proposal) {
      return NextResponse.json(
        { error: "Proposal not found" },
        { status: 404 }
      )
    }

    // Validate proposal status
    if (proposal.status === "signed") {
      return NextResponse.json(
        { error: "This proposal has already been signed" },
        { status: 409 }
      )
    }

    if (proposal.status !== "sent" && proposal.status !== "viewed") {
      return NextResponse.json(
        { error: "This proposal cannot be signed in its current state" },
        { status: 400 }
      )
    }

    const signedAt = new Date().toISOString()
    const signatureData = body.signatureData ?? ""

    // Update the signatureBlock node in the content
    const content = proposal.content as ProposalContent | null
    let updatedContent = content

    if (content) {
      updatedContent = updateSignatureBlockInContent(
        content,
        body.name.trim(),
        signedAt,
        body.signatureType,
        signatureData
      )
    }

    // Update the proposal
    const { error: updateError } = await supabase
      .from("proposals")
      .update({
        status: "signed",
        signed_at: signedAt,
        content: updatedContent,
      })
      .eq("id", proposalId)

    if (updateError) {
      console.error("Failed to update proposal:", updateError)
      return NextResponse.json(
        { error: "Failed to sign proposal" },
        { status: 500 }
      )
    }

    // Trigger async PDF generation for the signed proposal
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"
    fetch(`${siteUrl}/api/proposals/${proposalId}/pdf`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") ?? "",
      },
    }).catch(() => {
      // PDF generation is best-effort, don't block signing
    })

    return NextResponse.json({
      success: true,
      signedAt,
    })
  } catch (err) {
    console.error("Sign proposal error:", err)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
