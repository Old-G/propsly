"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { type JSONContent } from "@tiptap/core"
import dynamic from "next/dynamic"

const ProposalEditor = dynamic(
  () => import("@propsly/editor").then((m) => ({ default: m.ProposalEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-pulse text-[var(--text-tertiary)]">Loading editor...</div>
      </div>
    ),
  }
)
import { ArrowLeft, Check, Loader2, AlertCircle, Download, Settings, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EditorSidebar } from "./editor-sidebar"
import { SaveAsTemplateModal } from "./save-as-template-modal"
import { saveProposalContent } from "@/lib/actions/editor"
import { uploadProposalImage } from "@/lib/actions/upload"
import Link from "next/link"

type SaveStatus = "saved" | "saving" | "unsaved" | "error"

interface ProposalEditorWrapperProps {
  proposal: {
    id: string
    title: string
    slug: string
    content: JSONContent | null
    workspaceId: string
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

  // Handle image uploads from ImageBlock
  useEffect(() => {
    const handleImageUpload = async (e: Event) => {
      const event = e as CustomEvent<{
        file: File
        onSuccess: (url: string) => void
        onError: (error: string) => void
      }>
      const { file, onSuccess, onError } = event.detail

      const formData = new FormData()
      formData.append("file", file)
      formData.append("workspace_id", proposal.workspaceId)
      formData.append("proposal_id", proposal.id)

      const result = await uploadProposalImage(formData)
      if (result.error) {
        onError(result.error)
      } else if (result.url) {
        onSuccess(result.url)
      }
    }

    document.addEventListener("imageblock:upload", handleImageUpload)
    return () => {
      document.removeEventListener("imageblock:upload", handleImageUpload)
    }
  }, [proposal.id, proposal.workspaceId])

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
      <div className="flex items-center justify-between border-b border-[var(--border-default)] px-2 sm:px-4 py-2 gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href={`/proposals/${proposal.id}`}
            className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <span className="text-sm font-medium truncate max-w-32 sm:max-w-64">{proposal.title}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          {/* Save status */}
          <div className="flex items-center gap-1 text-xs">
            {saveStatus === "saved" && (
              <Check className="h-3.5 w-3.5 text-[var(--success)]" />
            )}
            {saveStatus === "saving" && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--text-tertiary)]" />
            )}
            {saveStatus === "unsaved" && (
              <AlertCircle className="h-3.5 w-3.5 text-[var(--warning)]" />
            )}
            {saveStatus === "error" && (
              <AlertCircle className="h-3.5 w-3.5 text-[var(--error)]" />
            )}
            <span className="hidden sm:inline text-[var(--text-tertiary)]">
              {saveStatus === "saved" && "Saved"}
              {saveStatus === "saving" && "Saving..."}
              {saveStatus === "unsaved" && "Unsaved"}
              {saveStatus === "error" && "Error"}
            </span>
          </div>

          <div className="hidden sm:block">
            <SaveAsTemplateModal proposalId={proposal.id} />
          </div>

          <Button
            variant="outline"
            size="sm"
            asChild
          >
            <a href={`/p/${proposal.slug}?pdf=true`} target="_blank" rel="noopener">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">PDF</span>
            </a>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="hidden sm:inline">Settings</span>
            <Settings className="h-4 w-4 sm:hidden" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            asChild
          >
            <Link href={`/p/${proposal.slug}`} target="_blank" rel="noopener">
              <span className="hidden sm:inline">Preview</span>
              <Eye className="h-4 w-4 sm:hidden" />
            </Link>
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
            workspaceId={proposal.workspaceId}
            onClose={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  )
}
