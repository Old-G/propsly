"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { FileText, Trash2, Layout } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createProposalFromTemplate } from "@/lib/actions/proposals"
import { deleteTemplate } from "@/lib/actions/templates"
import { toast } from "sonner"

interface Template {
  id: string
  name: string
  description: string | null
  category: string | null
  is_system: boolean
  workspace_id: string | null
}

interface TemplatesGalleryProps {
  templates: Template[]
  categories: string[]
  workspaceId: string
  userId: string
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
}

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export function TemplatesGallery({ templates, categories, workspaceId, userId }: TemplatesGalleryProps) {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = activeCategory === "all"
    ? templates
    : templates.filter((t) => t.category === activeCategory)

  async function handleUseTemplate(templateId: string) {
    setLoading(templateId)
    const result = await createProposalFromTemplate({ workspaceId, userId, templateId })
    if (result.error) {
      toast.error(result.error)
      setLoading(null)
      return
    }
    router.push(`/proposals/${result.proposalId}/edit`)
  }

  function handleDelete(templateId: string) {
    startTransition(async () => {
      const result = await deleteTemplate(templateId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Template deleted")
      }
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Templates</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Start from a template or create your own
          </p>
        </div>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      {/* Templates grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        key={activeCategory}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((template) => (
          <motion.div key={template.id} variants={item}>
            <Card className="group relative transition-colors hover:border-[var(--accent-border)]">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-elevated)]">
                    {loading === template.id ? (
                      <span className="size-4 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
                    ) : (
                      <Layout className="h-5 w-5 text-[var(--accent)]" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    {template.is_system && (
                      <Badge variant="outline" className="text-xs">System</Badge>
                    )}
                    {template.category && (
                      <Badge variant="secondary" className="text-xs capitalize">
                        {template.category}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="mt-3 font-medium">{template.name}</p>
                {template.description && (
                  <p className="mt-1 text-sm text-[var(--text-secondary)] line-clamp-2">
                    {template.description}
                  </p>
                )}
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleUseTemplate(template.id)}
                    disabled={loading === template.id}
                  >
                    Use Template
                  </Button>
                  {!template.is_system && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(template.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4 text-[var(--error)]" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16">
          <FileText className="h-12 w-12 text-[var(--text-tertiary)]" />
          <p className="mt-4 text-[var(--text-secondary)]">No templates in this category</p>
        </div>
      )}
    </div>
  )
}
