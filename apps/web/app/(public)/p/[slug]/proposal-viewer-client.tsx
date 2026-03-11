"use client"

import { ProposalViewer } from "@propsly/editor"
import type { JSONContent } from "@tiptap/core"

interface ProposalViewerClientProps {
  content: Record<string, unknown>
}

export function ProposalViewerClient({ content }: ProposalViewerClientProps) {
  return <ProposalViewer content={content as JSONContent} />
}
