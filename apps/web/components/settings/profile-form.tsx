"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { updateProfile, signOut } from "@/lib/actions/settings"

interface ProfileFormProps {
  profile: {
    email: string
    fullName: string
    avatarUrl: string
  }
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)

    const result = await updateProfile(formData)

    if (result.error) {
      setMessage({ type: "error", text: result.error })
    } else {
      setMessage({ type: "success", text: "Profile updated" })
    }
    setLoading(false)
  }

  async function handleSignOut() {
    await signOut()
    router.push("/login")
  }

  return (
    <div className="space-y-8">
      <form action={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={profile.email} disabled className="mt-1" />
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">
            Email is managed by your OAuth provider
          </p>
        </div>

        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile.fullName}
            placeholder="Your name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="avatar_url">Avatar URL</Label>
          <Input
            id="avatar_url"
            name="avatar_url"
            defaultValue={profile.avatarUrl}
            placeholder="https://example.com/avatar.jpg"
            type="url"
            className="mt-1"
          />
        </div>

        {message && (
          <div
            className={`rounded-lg border p-3 text-sm ${
              message.type === "success"
                ? "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]"
                : "border-[var(--error)]/30 bg-[var(--error)]/10 text-[var(--error)]"
            }`}
          >
            {message.text}
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>

      <Separator />

      <div>
        <h2 className="text-lg font-medium mb-2">Sign Out</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          Sign out of your Propsly account
        </p>
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  )
}
