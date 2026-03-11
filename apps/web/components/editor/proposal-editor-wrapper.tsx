"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { type JSONContent } from "@tiptap/core"
import { ProposalEditor } from "@propsly/editor"
import { ArrowLeft, Check, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditorSidebar } from "./editor-sidebar"
import { saveProposalContent, updateProposalSettings } from "@/lib/actions/editor"
import Link from "next/link"

type SaveStatus = "saved" | "saving" | "unsaved" | "error"

interface ProposalEditorWrapperProps {
  proposal: {
    id: string
    title: string
    slug: string
    content: JSONContent | null
    clientName: string
    clientEmail: string
    clientCompany: string
    status: string
    currency: string
    totalAmount: string
    expiresAt: string
  }
}

export function ProposalEditorWrapper({ proposal }: ProposalEditorWrapperProps) {
  const router = useRouter()
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const contentRef = useRef<JSONContent | null>(null)

  const handleSave = useCallback(
    async (content: JSONContent) => {
      setSaveStatus("saving")
      const result = await saveProposalContent(proposal.id, content)
      if (result.error) {
        setSaveStatus("error")
      } else {
        setSaveStatus("saved")
      }
    },
    [proposal.id]
  )

  const handleUpdate = useCallback(
    (content: JSONContent) => {
      contentRef.current = content
      setSaveStatus("unsaved")

      // Debounced autosave (5 seconds)
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(() => {
        if (contentRef.current) {
          handleSave(contentRef.current)
        }
      }, 5000)
    },
    [handleSave]
  )

  // Save on unmount / page leave
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      if (contentRef.current && saveStatus === "unsaved") {
        // Fire and forget
        saveProposalContent(proposal.id, contentRef.current)
      }
    }
  }, [proposal.id, saveStatus])

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Editor header */}
      <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-2">
        <div className="flex items-center gap-4">
          <Link
            href={`/proposals/${proposal.id}`}
            className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <span className="text-sm font-medium truncate max-w-64">{proposal.title}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Save status */}
          <div className="flex items-center gap-1.5 text-xs">
            {saveStatus === "saved" && (
              <>
                <Check className="h-3.5 w-3.5 text-[var(--success)]" />
                <span className="text-[var(--text-tertiary)]">Saved</span>
              </>
            )}
            {saveStatus === "saving" && (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--text-tertiary)]" />
                <span className="text-[var(--text-tertiary)]">Saving...</span>
              </>
            )}
            {saveStatus === "unsaved" && (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-[var(--warning)]" />
                <span className="text-[var(--warning)]">Unsaved</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-[var(--error)]" />
                <span className="text-[var(--error)]">Error saving</span>
              </>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            Settings
          </Button>

          <Button
            size="sm"
            variant="outline"
            asChild
          >
            <a href={`/p/${proposal.slug}`} target="_blank" rel="noopener">
              Preview
            </a>
          </Button>
        </div>
      </div>

      {/* Editor + Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <ProposalEditor
            content={proposal.content ?? undefined}
            onUpdate={handleUpdate}
          />
        </div>

        {sidebarOpen && (
          <EditorSidebar
            proposal={proposal}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
