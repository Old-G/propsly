import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProposalEditorWrapper } from "@/components/editor/proposal-editor-wrapper"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("proposals")
    .select("title")
    .eq("id", id)
    .single()

  return { title: data?.title ? `Edit: ${data.title}` : "Edit Proposal" }
}

export default async function EditProposalPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: proposal } = await supabase
    .from("proposals")
    .select("*")
    .eq("id", id)
    .single()

  if (!proposal) notFound()

  return (
    <ProposalEditorWrapper
      proposal={{
        id: proposal.id,
        title: proposal.title,
        slug: proposal.slug,
        content: proposal.content,
        clientName: proposal.client_name ?? "",
        clientEmail: proposal.client_email ?? "",
        clientCompany: proposal.client_company ?? "",
        status: proposal.status,
        currency: proposal.currency ?? "USD",
        totalAmount: proposal.total_amount ?? "",
        expiresAt: proposal.expires_at ?? "",
        workspaceId: proposal.workspace_id,
      }}
    />
  )
}
