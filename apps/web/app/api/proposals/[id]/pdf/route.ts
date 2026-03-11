import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generatePdfFromUrl } from "@/lib/services/pdf"

/**
 * Server-side PDF generation via Gotenberg (Docker).
 * Used in production self-hosted deployments.
 * For dev/cloud, use client-side print (/p/[slug]?pdf=true).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: proposalId } = await params
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: proposal, error } = await supabase
      .from("proposals")
      .select("id, title, slug, status, signed_pdf_url")
      .eq("id", proposalId)
      .single()

    if (error || !proposal) {
      return NextResponse.json({ error: "Proposal not found" }, { status: 404 })
    }

    if (proposal.signed_pdf_url) {
      return NextResponse.redirect(proposal.signed_pdf_url)
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"
    const pdfUrl = `${siteUrl}/p/${proposal.slug}?pdf=true`

    const pdfBuffer = await generatePdfFromUrl(pdfUrl)

    const filename = `${proposal.title.replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "proposal"}.pdf`

    // Store signed PDFs permanently
    if (proposal.status === "signed") {
      const storagePath = `proposals/${proposalId}/signed.pdf`
      const { error: uploadError } = await supabase.storage
        .from("proposal-pdfs")
        .upload(storagePath, new Uint8Array(pdfBuffer), {
          contentType: "application/pdf",
          upsert: true,
        })

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("proposal-pdfs")
          .getPublicUrl(storagePath)

        if (urlData?.publicUrl) {
          await supabase
            .from("proposals")
            .update({ signed_pdf_url: urlData.publicUrl })
            .eq("id", proposalId)
        }
      }
    }

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch (err) {
    console.error("PDF generation error:", err)

    return NextResponse.json(
      { error: "PDF service unavailable. Use browser print instead: /p/[slug]?pdf=true" },
      { status: 503 }
    )
  }
}
