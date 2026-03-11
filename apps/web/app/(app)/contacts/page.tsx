import { createClient } from "@/lib/supabase/server"
import { Users } from "lucide-react"

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

  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .eq("workspace_id", profile!.default_workspace_id!)
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contacts</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage your client contacts
          </p>
        </div>
      </div>

      {(!contacts || contacts.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Users className="h-12 w-12 text-[var(--text-tertiary)]" />
          <p className="mt-4 text-[var(--text-secondary)]">No contacts yet</p>
          <p className="text-sm text-[var(--text-tertiary)]">
            Contacts will be created when you add clients to proposals
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--border-default)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-default)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">Name</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">Email</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">Company</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--text-secondary)]">Phone</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="border-b border-[var(--border-default)] last:border-0 hover:bg-[var(--bg-surface-hover)]">
                  <td className="px-4 py-3 font-medium">{contact.name}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{contact.email ?? "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{contact.company ?? "—"}</td>
                  <td className="px-4 py-3 text-[var(--text-secondary)]">{contact.phone ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
