"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { updateProposalSettings } from "@/lib/actions/editor"

interface EditorSidebarProps {
  proposal: {
    id: string
    title: string
    slug: string
    clientName: string
    clientEmail: string
    clientCompany: string
    currency: string
    totalAmount: string
    expiresAt: string
  }
  onClose: () => void
}

export function EditorSidebar({ proposal, onClose }: EditorSidebarProps) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setSaving(true)
    setMessage(null)
    formData.set("id", proposal.id)
    const result = await updateProposalSettings(formData)
    if (result.error) {
      setMessage(result.error)
    } else {
      setMessage("Saved")
      setTimeout(() => setMessage(null), 2000)
    }
    setSaving(false)
  }

  return (
    <aside className="w-80 flex-shrink-0 overflow-y-auto border-l border-[var(--border-default)] bg-[var(--bg-surface)]">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-default)]">
        <h3 className="text-sm font-medium">Proposal Settings</h3>
        <button onClick={onClose} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
          <X className="h-4 w-4" />
        </button>
      </div>

      <form action={handleSubmit} className="p-4 space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={proposal.title} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={proposal.slug} className="mt-1 font-mono text-xs" />
        </div>

        <Separator />
        <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Client</p>

        <div>
          <Label htmlFor="client_name">Name</Label>
          <Input id="client_name" name="client_name" defaultValue={proposal.clientName} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="client_email">Email</Label>
          <Input id="client_email" name="client_email" defaultValue={proposal.clientEmail} type="email" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="client_company">Company</Label>
          <Input id="client_company" name="client_company" defaultValue={proposal.clientCompany} className="mt-1" />
        </div>

        <Separator />
        <p className="text-xs font-medium text-[var(--text-tertiary)] uppercase tracking-wider">Pricing</p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input id="currency" name="currency" defaultValue={proposal.currency} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="total_amount">Amount</Label>
            <Input id="total_amount" name="total_amount" defaultValue={proposal.totalAmount} type="number" step="0.01" className="mt-1" />
          </div>
        </div>

        <Separator />

        <div>
          <Label htmlFor="expires_at">Expires At</Label>
          <Input id="expires_at" name="expires_at" defaultValue={proposal.expiresAt ? proposal.expiresAt.split("T")[0] : ""} type="date" className="mt-1" />
        </div>

        {message && (
          <p className={`text-xs ${message === "Saved" ? "text-[var(--success)]" : "text-[var(--error)]"}`}>
            {message}
          </p>
        )}

        <Button type="submit" size="sm" disabled={saving} className="w-full">
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </aside>
  )
}
