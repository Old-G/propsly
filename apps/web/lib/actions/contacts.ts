"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createContact(input: {
  workspaceId: string
  name: string
  email?: string
  company?: string
  phone?: string
  notes?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const { data, error } = await supabase
    .from("contacts")
    .insert({
      workspace_id: input.workspaceId,
      name: input.name,
      email: input.email || null,
      company: input.company || null,
      phone: input.phone || null,
      notes: input.notes || null,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath("/contacts")
  return { contact: data }
}

export async function updateContact(input: {
  id: string
  name: string
  email?: string
  company?: string
  phone?: string
  notes?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const { data, error } = await supabase
    .from("contacts")
    .update({
      name: input.name,
      email: input.email || null,
      company: input.company || null,
      phone: input.phone || null,
      notes: input.notes || null,
    })
    .eq("id", input.id)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath("/contacts")
  return { contact: data }
}

export async function deleteContact(id: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/contacts")
  return { success: true }
}
