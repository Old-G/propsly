"use client"

import { useState, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createContact, updateContact } from "@/lib/actions/contacts"
import { toast } from "sonner"

interface Contact {
  id: string
  name: string
  email: string | null
  company: string | null
  phone: string | null
  notes: string | null
}

interface ContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  contact?: Contact | null
}

export function ContactDialog({
  open,
  onOpenChange,
  workspaceId,
  contact,
}: ContactDialogProps) {
  const isEditing = !!contact
  const [isPending, startTransition] = useTransition()

  const [name, setName] = useState(contact?.name ?? "")
  const [email, setEmail] = useState(contact?.email ?? "")
  const [company, setCompany] = useState(contact?.company ?? "")
  const [phone, setPhone] = useState(contact?.phone ?? "")
  const [notes, setNotes] = useState(contact?.notes ?? "")

  // Reset form when dialog opens with different contact
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName(contact?.name ?? "")
      setEmail(contact?.email ?? "")
      setCompany(contact?.company ?? "")
      setPhone(contact?.phone ?? "")
      setNotes(contact?.notes ?? "")
    }
    onOpenChange(open)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Name is required")
      return
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateContact({
            id: contact.id,
            name: name.trim(),
            email: email.trim() || undefined,
            company: company.trim() || undefined,
            phone: phone.trim() || undefined,
            notes: notes.trim() || undefined,
          })
        : await createContact({
            workspaceId,
            name: name.trim(),
            email: email.trim() || undefined,
            company: company.trim() || undefined,
            phone: phone.trim() || undefined,
            notes: notes.trim() || undefined,
          })

      if (result.error) {
        toast.error(result.error)
        return
      }

      toast.success(isEditing ? "Contact updated" : "Contact created")
      handleOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Contact" : "Add Contact"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update this contact's information."
              : "Add a new contact to your workspace."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contact-name">Name *</Label>
            <Input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-company">Company</Label>
            <Input
              id="contact-company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Inc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-phone">Phone</Label>
            <Input
              id="contact-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-notes">Notes</Label>
            <textarea
              id="contact-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this contact..."
              rows={3}
              className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2 text-sm placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Add Contact"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
