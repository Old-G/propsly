"use client"

import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react"
import type { SignatureType } from "../extensions/signature-block"

export function SignatureBlockEditorView({ node, selected }: NodeViewProps) {
  const signedBy = node.attrs.signedBy as string
  const signedAt = node.attrs.signedAt as string
  const signatureData = node.attrs.signatureData as string
  const signatureType = node.attrs.signatureType as SignatureType

  const isSigned = signatureType !== "none" && signedBy

  return (
    <NodeViewWrapper
      data-type="signatureBlock"
      style={{
        border: `${selected ? "2px solid var(--accent, #34d399)" : "1px dashed var(--border-default, #333)"}`,
        borderRadius: "8px",
        padding: "24px",
        background: "var(--bg-surface, #1a1a1a)",
        textAlign: "center",
      }}
    >
      {isSigned ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--accent, #34d399)",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Signed
          </div>
          {signatureType === "drawn" && signatureData ? (
            <div
              style={{
                maxWidth: "300px",
                padding: "8px",
              }}
              dangerouslySetInnerHTML={{ __html: signatureData }}
            />
          ) : (
            <div
              style={{
                fontFamily: "var(--font-instrument-serif, Georgia, serif)",
                fontSize: "28px",
                fontStyle: "italic",
                color: "var(--text-primary, #fff)",
              }}
            >
              {signedBy}
            </div>
          )}
          {signedAt && (
            <div style={{ fontSize: "12px", color: "var(--text-tertiary, #666)" }}>
              Signed on{" "}
              {new Date(signedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-tertiary, #666)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m21.174 6.812-3.524-3.524 2.112-2.112c.477-.476 1.25-.476 1.726 0l1.8 1.8a1.22 1.22 0 0 1 0 1.724l-2.114 2.112z" />
            <path d="m14.344 10.162 6.83-6.83" />
            <path d="M14 21H3v-4l7.5-7.5" />
            <path d="M3 21c3 0 4.5-1.5 4.5-1.5" />
          </svg>
          <div style={{ color: "var(--text-secondary, #888)", fontSize: "14px", fontWeight: 500 }}>
            Signature block
          </div>
          <div style={{ color: "var(--text-tertiary, #666)", fontSize: "12px" }}>
            Clients will sign here when viewing the proposal
          </div>
        </div>
      )}
    </NodeViewWrapper>
  )
}
