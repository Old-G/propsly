"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { BookmarkPlus } from "lucide-react"
import { saveAsTemplate } from "@/lib/actions/templates"
import { toast } from "sonner"

interface SaveAsTemplateModalProps {
  proposalId: string
}

const CATEGORIES = ["design", "development", "marketing", "consulting"]

export function SaveAsTemplateModal({ proposalId }: SaveAsTemplateModalProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    if (!name.trim()) {
      toast.error("Template name is required")
      return
    }

    startTransition(async () => {
      const result = await saveAsTemplate({
        proposalId,
        name: name.trim(),
        description: description.trim() || undefined,
        category: category || undefined,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Saved as template!")
        setOpen(false)
        setName("")
        setDescription("")
        setCategory("")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" />
          Save as Template
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save as Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="template-name">Name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Web Design Proposal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-desc">Description (optional)</Label>
            <Textarea
              id="template-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this template"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="template-cat">Category (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(category === cat ? "" : cat)}
                  className="capitalize"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={handleSave} disabled={isPending} className="w-full">
            {isPending ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
