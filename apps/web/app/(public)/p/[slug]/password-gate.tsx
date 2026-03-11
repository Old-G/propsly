"use client"

import { useState, type FormEvent } from "react"

interface PasswordGateProps {
  proposalId: string
  slug: string
  proposalTitle: string
}

export function PasswordGate({ proposalId, slug, proposalTitle }: PasswordGateProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch(`/api/proposals/${proposalId}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, proposalId }),
      })

      const data = (await res.json()) as { success?: boolean; error?: string; accessToken?: string }

      if (data.success && data.accessToken) {
        // Set signed access token cookie and reload to show content
        document.cookie = `proposal_access_${slug}=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
        window.location.reload()
      } else {
        setError(data.error ?? "Incorrect password")
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="w-full max-w-sm">
        {/* Lock icon */}
        <div className="mb-6">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto text-[var(--accent)]"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h1 className="heading-display text-xl text-[var(--text-primary)] sm:text-2xl">
          This proposal is protected
        </h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Enter the password to view{" "}
          <span className="text-[var(--text-primary)]">{proposalTitle}</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-8">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            autoFocus
            className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--accent-border)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-border)] transition-colors"
          />

          {error && (
            <p className="mt-3 text-sm text-[var(--error)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="btn-primary mt-4 w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Verifying..." : "View Proposal"}
          </button>
        </form>
      </div>
    </div>
  )
}
