"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface NotificationItem {
  id: string
  type: string
  proposalId: string | null
  message: string | null
  read: boolean
  createdAt: string
}

export async function getNotifications(limit = 10): Promise<NotificationItem[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("notifications")
    .select("id, type, proposal_id, message, read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit)

  return (data ?? []).map((n) => ({
    id: n.id,
    type: n.type,
    proposalId: n.proposal_id,
    message: n.message,
    read: n.read,
    createdAt: n.created_at,
  }))
}

export async function markNotificationRead(id: string) {
  const supabase = await createClient()
  await supabase.from("notifications").update({ read: true }).eq("id", id)
  revalidatePath("/(app)", "layout")
}

export async function markAllNotificationsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false)
  revalidatePath("/(app)", "layout")
}
