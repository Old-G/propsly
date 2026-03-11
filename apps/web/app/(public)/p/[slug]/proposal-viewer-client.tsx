"use client"

import { ProposalViewer, SignatureBlockViewer } from "@propsly/editor"
import type { JSONContent } from "@tiptap/core"
import type { SignatureType } from "@propsly/editor"

interface SignatureInfo {
  signedBy: string
  signedAt: string
  signatureData: string
  signatureType: SignatureType
}

interface ProposalViewerClientProps {
  content: Record<string, unknown>
  variables?: Record<string, string>
  proposalId: string
  proposalStatus: string
  signatureInfo: SignatureInfo | null
}

export function ProposalViewerClient({
  content,
  variables,
  proposalId,
  proposalStatus,
  signatureInfo,
}: ProposalViewerClientProps) {
  const hasSignatureBlock = signatureInfo !== null
  const isSigned = proposalStatus === "signed"

  return (
    <>
      <ProposalViewer content={content as JSONContent} variables={variables} />
      {hasSignatureBlock && (
        <div style={{ marginTop: "32px" }}>
          <SignatureBlockViewer
            proposalId={proposalId}
            signedBy={isSigned ? signatureInfo.signedBy : undefined}
            signedAt={isSigned ? signatureInfo.signedAt : undefined}
            signatureData={isSigned ? signatureInfo.signatureData : undefined}
            signatureType={isSigned ? signatureInfo.signatureType : undefined}
          />
        </div>
      )}
    </>
  )
}
