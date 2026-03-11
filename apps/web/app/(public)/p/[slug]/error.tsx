"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Proposal viewer error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mb-4 text-[var(--error)]"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">
        Something went wrong
      </h2>
      <p className="mt-2 max-w-md text-sm text-[var(--text-secondary)]">
        We couldn&apos;t load this proposal. This might be a temporary issue.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={reset} variant="outline" size="sm">
          Try again
        </Button>
        <Button asChild variant="ghost" size="sm">
          <a href="https://propsly.org">Go to Propsly</a>
        </Button>
      </div>
    </div>
  )
}
