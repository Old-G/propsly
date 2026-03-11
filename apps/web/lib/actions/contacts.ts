"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getContactWithProposals(contactId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  const { data: contact, error } = await supabase
    .from("contacts")
    .select("*")
    .eq("id", contactId)
    .single()

  if (error || !contact) return { error: "Contact not found" }

  const { data: proposals } = await supabase
    .from("proposals")
    .select("id, title, status, total_amount, currency, created_at, slug")
    .eq("contact_id", contactId)
    .order("created_at", { ascending: false })

  // Also find proposals by matching client_email (even without contact_id link)
  let emailProposals: typeof proposals = []
  if (contact.email) {
    const { data } = await supabase
      .from("proposals")
      .select("id, title, status, total_amount, currency, created_at, slug")
      .eq("client_email", contact.email)
      .is("contact_id", null)
      .order("created_at", { ascending: false })
    emailProposals = data ?? []
  }

  const allProposals = [...(proposals ?? []), ...(emailProposals ?? [])]
  // Deduplicate by id
  const seen = new Set<string>()
  const uniqueProposals = allProposals.filter((p) => {
    if (seen.has(p.id)) return false
    seen.add(p.id)
    return true
  })

  return { contact, proposals: uniqueProposals }
}

export async function searchContacts(workspaceId: string, query: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { contacts: [] }

  // Sanitize query: escape PostgREST special characters to prevent filter injection
  const sanitized = query
    .replace(/\\/g, "\\\\")
    .replace(/%/g, "\\%")
    .replace(/_/g, "\\_")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/,/g, "\\,")
    .replace(/\./g, "\\.")

  const { data } = await supabase
    .from("contacts")
    .select("id, name, email, company")
    .eq("workspace_id", workspaceId)
    .or(`name.ilike.%${sanitized}%,email.ilike.%${sanitized}%,company.ilike.%${sanitized}%`)
    .order("name")
    .limit(5)

  return { contacts: data ?? [] }
}

export async function findOrCreateContact(input: {
  workspaceId: string
  name: string
  email?: string
  company?: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: "Unauthorized" }

  // Try to find existing contact by email first
  if (input.email) {
    const { data: existing } = await supabase
      .from("contacts")
      .select("id")
      .eq("workspace_id", input.workspaceId)
      .eq("email", input.email)
      .single()

    if (existing) return { contactId: existing.id }
  }

  // Create new contact
  const { data, error } = await supabase
    .from("contacts")
    .insert({
      workspace_id: input.workspaceId,
      name: input.name,
      email: input.email || null,
      company: input.company || null,
    })
    .select("id")
    .single()

  if (error) return { error: error.message }

  revalidatePath("/contacts")
  return { contactId: data.id }
}

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
