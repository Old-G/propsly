"use server"

import { createClient } from "@/lib/supabase/server"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_PREFIXES = ["image/"]
const BUCKET_NAME = "proposal-images"

interface UploadResult {
  url?: string
  error?: string
}

export async function uploadProposalImage(
  formData: FormData
): Promise<UploadResult> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const file = formData.get("file") as File | null
  const workspaceId = formData.get("workspace_id") as string | null
  const proposalId = formData.get("proposal_id") as string | null

  if (!file) return { error: "No file provided" }
  if (!workspaceId) return { error: "Missing workspace_id" }
  if (!proposalId) return { error: "Missing proposal_id" }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return { error: "File must be under 5MB" }
  }

  // Validate mime type
  const isImage = ALLOWED_MIME_PREFIXES.some((prefix) =>
    file.type.startsWith(prefix)
  )
  if (!isImage) {
    return { error: "File must be an image" }
  }

  // Generate a unique filename to avoid collisions
  const ext = file.name.split(".").pop() ?? "png"
  const timestamp = Date.now()
  const safeName = `${timestamp}-${crypto.randomUUID().slice(0, 8)}.${ext}`
  const path = `${workspaceId}/${proposalId}/${safeName}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, buffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    })

  if (uploadError) {
    return { error: `Upload failed: ${uploadError.message}` }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)

  return { url: publicUrl }
}
