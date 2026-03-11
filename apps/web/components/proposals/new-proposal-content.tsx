"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createProposalFromTemplate } from "@/lib/actions/proposals"

interface Template {
  id: string
  name: string
  description: string | null
  category: string | null
  is_system: boolean
}

interface NewProposalContentProps {
  templates: Template[]
  workspaceId: string
  userId: string
}

export function NewProposalContent({ templates, workspaceId, userId }: NewProposalContentProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCreate(templateId?: string) {
    setLoading(templateId ?? "blank")

    const result = await createProposalFromTemplate({
      workspaceId,
      userId,
      templateId,
    })

    if (result.error) {
      setLoading(null)
      return
    }

    router.push(`/proposals/${result.proposalId}/edit`)
  }

  return (
    <div className="space-y-6">
      {/* Blank proposal */}
      <Card
        className="cursor-pointer transition-colors hover:border-[var(--accent-border)]"
        onClick={() => handleCreate()}
      >
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent-muted)]">
            {loading === "blank" ? (
              <span className="size-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
            ) : (
              <Plus className="h-6 w-6 text-[var(--accent)]" />
            )}
          </div>
          <div>
            <p className="font-medium">Blank Proposal</p>
            <p className="text-sm text-[var(--text-secondary)]">Start from scratch</p>
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      {templates.length > 0 && (
        <>
          <h2 className="text-lg font-medium">Templates</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer transition-colors hover:border-[var(--accent-border)]"
                onClick={() => handleCreate(template.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-elevated)]">
                      {loading === template.id ? (
                        <span className="size-4 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
                      ) : (
                        <FileText className="h-5 w-5 text-[var(--text-secondary)]" />
                      )}
                    </div>
                    {template.is_system && (
                      <Badge variant="outline" className="text-xs">System</Badge>
                    )}
                  </div>
                  <p className="mt-3 font-medium">{template.name}</p>
                  {template.description && (
                    <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
                      {template.description}
                    </p>
                  )}
                  {template.category && (
                    <Badge variant="secondary" className="mt-3 text-xs capitalize">
                      {template.category}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
