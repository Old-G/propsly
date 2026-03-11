"use client"

import { useState } from "react"
import Link from "next/link"
import { ExternalLink, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShareModal } from "@/components/proposals/share-modal"

interface ProposalActionsProps {
  proposalId: string
  proposalSlug: string
  proposalTitle: string
}

export function ProposalActions({
  proposalId,
  proposalSlug,
  proposalTitle,
}: ProposalActionsProps) {
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <>
      <div className="flex gap-2">
        <Button size="sm" asChild>
          <Link href={`/proposals/${proposalId}/edit`}>Edit</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`/p/${proposalSlug}`} target="_blank" rel="noopener">
            <ExternalLink className="h-4 w-4" />
            Preview
          </a>
        </Button>
        <Button size="sm" onClick={() => setShareOpen(true)}>
          <Send className="h-4 w-4" />
          Share
        </Button>
      </div>

      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        proposalId={proposalId}
        proposalSlug={proposalSlug}
        proposalTitle={proposalTitle}
      />
    </>
  )
}
