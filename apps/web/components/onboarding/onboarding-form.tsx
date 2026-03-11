"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createWorkspace } from "@/lib/actions/onboarding"

const INDUSTRIES = [
  "Agency",
  "Consulting",
  "Design",
  "Development",
  "Marketing",
  "Real Estate",
  "SaaS",
  "Other",
] as const

interface OnboardingFormProps {
  userId: string
  userEmail: string
  userName: string
}

export function OnboardingForm({ userId }: OnboardingFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [companyName, setCompanyName] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [brandPrimary, setBrandPrimary] = useState("#34d399")
  const [brandSecondary, setBrandSecondary] = useState("#0a0a0a")
  const [industry, setIndustry] = useState("")

  const steps = [
    { title: "Company Name", description: "What's your company or business called?" },
    { title: "Logo", description: "Upload your company logo (optional)" },
    { title: "Brand Colors", description: "Choose your brand colors" },
    { title: "Industry", description: "What industry are you in?" },
  ]

  async function handleComplete() {
    setLoading(true)
    setError(null)

    try {
      const result = await createWorkspace({
        userId,
        name: companyName,
        logoUrl: logoUrl || undefined,
        brandPrimaryColor: brandPrimary,
        brandSecondaryColor: brandSecondary,
        industry: industry || undefined,
      })

      if (result.error) {
        setError(result.error)
        setLoading(false)
        return
      }

      router.push("/dashboard")
    } catch {
      setError("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  function handleNext() {
    if (step === 0 && !companyName.trim()) {
      setError("Company name is required")
      return
    }
    setError(null)
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  function handleBack() {
    setError(null)
    if (step > 0) setStep(step - 1)
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-[var(--accent)]" : "bg-[var(--border-default)]"
            }`}
          />
        ))}
      </div>

      {/* Step header */}
      <h2 className="text-lg font-medium mb-1">{steps[step].title}</h2>
      <p className="text-sm text-[var(--text-secondary)] mb-6">{steps[step].description}</p>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-[var(--error)]/30 bg-[var(--error)]/10 p-3 text-sm text-[var(--error)]">
          {error}
        </div>
      )}

      {/* Step content */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Acme Inc."
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
            />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="logo-url">Logo URL</Label>
            <Input
              id="logo-url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://example.com/logo.png"
              type="url"
            />
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">
              Paste a URL to your logo. File upload coming soon.
            </p>
          </div>
          {logoUrl && (
            <div className="flex items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
              <img src={logoUrl} alt="Logo preview" className="max-h-16 max-w-[200px] object-contain" />
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="brand-primary">Primary Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="brand-primary"
                value={brandPrimary}
                onChange={(e) => setBrandPrimary(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-[var(--border-default)] bg-transparent"
              />
              <Input
                value={brandPrimary}
                onChange={(e) => setBrandPrimary(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="brand-secondary">Secondary Color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                id="brand-secondary"
                value={brandSecondary}
                onChange={(e) => setBrandSecondary(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border border-[var(--border-default)] bg-transparent"
              />
              <Input
                value={brandSecondary}
                onChange={(e) => setBrandSecondary(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          {/* Preview */}
          <div className="rounded-lg border border-[var(--border-default)] p-4">
            <p className="text-xs text-[var(--text-tertiary)] mb-2">Preview</p>
            <div className="flex gap-3">
              <div className="h-12 flex-1 rounded-lg" style={{ background: brandPrimary }} />
              <div className="h-12 flex-1 rounded-lg" style={{ background: brandSecondary }} />
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="grid grid-cols-2 gap-3">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustry(ind)}
              className={`rounded-lg border p-3 text-sm text-left transition-colors ${
                industry === ind
                  ? "border-[var(--accent)] bg-[var(--accent-muted)] text-[var(--accent)]"
                  : "border-[var(--border-default)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-surface-hover)]"
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <Button variant="outline" onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        <Button onClick={handleNext} disabled={loading} className="flex-1">
          {loading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : step === steps.length - 1 ? (
            "Create Workspace"
          ) : (
            "Continue"
          )}
        </Button>
        {step > 0 && step < steps.length - 1 && (
          <Button variant="ghost" onClick={handleNext} disabled={loading}>
            Skip
          </Button>
        )}
      </div>
    </div>
  )
}
