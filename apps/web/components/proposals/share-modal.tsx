"use client"

import { useState, useCallback } from "react"
import { Copy, Check, Send, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3002"

interface ShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  proposalId: string
  proposalSlug: string
  proposalTitle: string
}

export function ShareModal({
  open,
  onOpenChange,
  proposalId,
  proposalSlug,
  proposalTitle,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  const publicUrl = `${BASE_URL}/p/${proposalSlug}`

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      toast.success("Link copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy link")
    }
  }, [publicUrl])

  const handleSend = useCallback(async () => {
    if (!email.trim()) {
      toast.error("Please enter an email address")
      return
    }

    setSending(true)

    try {
      const res = await fetch(`/api/proposals/${proposalId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          message: message.trim() || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? "Failed to send proposal")
        return
      }

      toast.success(`Proposal sent to ${email.trim()}`)
      setEmail("")
      setMessage("")
      onOpenChange(false)
    } catch {
      toast.error("Something went wrong")
    } finally {
      setSending(false)
    }
  }, [email, message, proposalId, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Proposal</DialogTitle>
          <DialogDescription>
            Share &ldquo;{proposalTitle}&rdquo; with your client.
          </DialogDescription>
        </DialogHeader>

        {/* Copy Link Section */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
            Copy Link
          </Label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={publicUrl}
              className="font-mono text-xs"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-[var(--success)]" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <Separator />

        {/* Send via Email Section */}
        <div className="space-y-4">
          <Label className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
            Send via Email
          </Label>
          <div className="space-y-2">
            <Label htmlFor="share-email">Recipient email</Label>
            <Input
              id="share-email"
              type="email"
              placeholder="client@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="share-message">
              Personal message{" "}
              <span className="text-[var(--text-tertiary)] font-normal">(optional)</span>
            </Label>
            <Textarea
              id="share-message"
              placeholder="Hi, here's the proposal we discussed..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={sending || !email.trim()}
            className="w-full"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {sending ? "Sending..." : "Send Proposal"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
