"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { updateWorkspace } from "@/lib/actions/settings"

interface WorkspaceFormProps {
  workspace: {
    id: string
    name: string
    logoUrl: string
    brandPrimaryColor: string
    brandSecondaryColor: string
    companyWebsite: string
    companyPhone: string
    companyAddress: string
    industry: string
  }
  isAdmin: boolean
}

export function WorkspaceForm({ workspace, isAdmin }: WorkspaceFormProps) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setMessage(null)

    formData.set("workspace_id", workspace.id)
    const result = await updateWorkspace(formData)

    if (result.error) {
      setMessage({ type: "error", text: result.error })
    } else {
      setMessage({ type: "success", text: "Workspace updated" })
    }
    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Workspace Name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={workspace.name}
          disabled={!isAdmin}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="logo_url">Logo URL</Label>
        <Input
          id="logo_url"
          name="logo_url"
          defaultValue={workspace.logoUrl}
          placeholder="https://example.com/logo.png"
          type="url"
          disabled={!isAdmin}
          className="mt-1"
        />
      </div>

      <Separator />
      <h2 className="text-lg font-medium">Brand</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand_primary_color">Primary Color</Label>
          <div className="flex items-center gap-3 mt-1">
            <input
              type="color"
              id="brand_primary_color"
              name="brand_primary_color"
              defaultValue={workspace.brandPrimaryColor}
              disabled={!isAdmin}
              className="h-10 w-10 cursor-pointer rounded border border-[var(--border-default)] bg-transparent"
            />
            <Input
              defaultValue={workspace.brandPrimaryColor}
              disabled={!isAdmin}
              className="flex-1"
              onChange={(e) => {
                const colorInput = document.getElementById("brand_primary_color") as HTMLInputElement
                if (colorInput) colorInput.value = e.target.value
              }}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="brand_secondary_color">Secondary Color</Label>
          <div className="flex items-center gap-3 mt-1">
            <input
              type="color"
              id="brand_secondary_color"
              name="brand_secondary_color"
              defaultValue={workspace.brandSecondaryColor}
              disabled={!isAdmin}
              className="h-10 w-10 cursor-pointer rounded border border-[var(--border-default)] bg-transparent"
            />
            <Input
              defaultValue={workspace.brandSecondaryColor}
              disabled={!isAdmin}
              className="flex-1"
              onChange={(e) => {
                const colorInput = document.getElementById("brand_secondary_color") as HTMLInputElement
                if (colorInput) colorInput.value = e.target.value
              }}
            />
          </div>
        </div>
      </div>

      <Separator />
      <h2 className="text-lg font-medium">Company Info</h2>

      <div>
        <Label htmlFor="company_website">Website</Label>
        <Input
          id="company_website"
          name="company_website"
          defaultValue={workspace.companyWebsite}
          placeholder="https://example.com"
          type="url"
          disabled={!isAdmin}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="company_phone">Phone</Label>
        <Input
          id="company_phone"
          name="company_phone"
          defaultValue={workspace.companyPhone}
          placeholder="+1 (555) 123-4567"
          disabled={!isAdmin}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="company_address">Address</Label>
        <Input
          id="company_address"
          name="company_address"
          defaultValue={workspace.companyAddress}
          placeholder="123 Main St, City, State"
          disabled={!isAdmin}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="industry">Industry</Label>
        <Input
          id="industry"
          name="industry"
          defaultValue={workspace.industry}
          placeholder="e.g. Agency, Consulting, SaaS"
          disabled={!isAdmin}
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

      {isAdmin && (
        <Button type="submit" disabled={loading}>
          {loading ? (
            <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            "Save Changes"
          )}
        </Button>
      )}

      {!isAdmin && (
        <p className="text-sm text-[var(--text-tertiary)]">
          Only workspace owners and admins can edit these settings.
        </p>
      )}
    </form>
  )
}
