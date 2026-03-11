import { createClient } from "@/lib/supabase/server"
import { ContactsList } from "@/components/contacts/contacts-list"

export const metadata = {
  title: "Contacts",
}

export default async function ContactsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from("profiles")
    .select("default_workspace_id")
    .eq("id", user!.id)
    .single()

  const workspaceId = profile!.default_workspace_id!
  const perPage = 20

  const { data: contacts, count } = await supabase
    .from("contacts")
    .select("*", { count: "exact" })
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false })
    .range(0, perPage - 1)

  return (
    <ContactsList
      contacts={contacts ?? []}
      totalCount={count ?? 0}
      workspaceId={workspaceId}
      perPage={perPage}
    />
  )
}
