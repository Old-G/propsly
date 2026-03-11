"use client"

import { useState, useTransition } from "react"
import { Sparkles, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { submitUpgradeRequest } from "@/lib/actions/upgrade"
import { toast } from "sonner"

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
}

const proFeatures = [
  "Unlimited proposals",
  "AI copilot (coming soon)",
  "Custom branding",
  "Priority support",
]

export function UpgradeModal({
  open,
  onOpenChange,
  workspaceId,
}: UpgradeModalProps) {
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await submitUpgradeRequest({
        workspaceId,
        requestedPlan: "pro",
        message: message.trim() || undefined,
      })

      if (result.error) {
        toast.error(result.error)
        return
      }

      setSubmitted(true)
      toast.success("Thanks! We'll reach out soon.")
    })
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      setSubmitted(false)
      setMessage("")
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--accent)]" />
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription>
            Unlock unlimited proposals and premium features.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-[var(--success)]/10 flex items-center justify-center">
              <Check className="h-6 w-6 text-[var(--success)]" />
            </div>
            <p className="font-medium">Request received!</p>
            <p className="text-sm text-[var(--text-secondary)]">
              We&apos;ll email you when Pro is available. Meanwhile, you can keep
              creating proposals with no restrictions.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--border-default)] p-4 space-y-2">
              <p className="text-sm font-medium">Pro — $19/user/mo</p>
              <ul className="space-y-1.5">
                {proFeatures.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"
                  >
                    <Check className="h-3.5 w-3.5 text-[var(--accent)] flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Any specific features you need? (optional)"
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="w-full"
            >
              {isPending ? "Submitting..." : "I want Pro"}
            </Button>

            <p className="text-xs text-center text-[var(--text-tertiary)]">
              Payments coming soon. No charge until then.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
