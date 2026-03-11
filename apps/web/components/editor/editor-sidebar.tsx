"use client"

import { useState } from "react"
import { X, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { updateProposalSettings } from "@/lib/actions/editor"
import { cn } from "@/lib/utils"

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
  const [expiresDate, setExpiresDate] = useState<Date | undefined>(
    proposal.expiresAt ? new Date(proposal.expiresAt) : undefined
  )
  const [calendarOpen, setCalendarOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    setSaving(true)
    setMessage(null)
    formData.set("id", proposal.id)
    if (expiresDate) {
      formData.set("expires_at", format(expiresDate, "yyyy-MM-dd"))
    } else {
      formData.set("expires_at", "")
    }
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
          <Label>Expires At</Label>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "mt-1 w-full justify-start text-left font-normal",
                  !expiresDate && "text-[var(--text-tertiary)]"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expiresDate ? format(expiresDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={expiresDate}
                onSelect={(date) => {
                  setExpiresDate(date)
                  setCalendarOpen(false)
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
              {expiresDate && (
                <div className="border-t border-[var(--border-default)] p-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => {
                      setExpiresDate(undefined)
                      setCalendarOpen(false)
                    }}
                  >
                    Clear date
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
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
