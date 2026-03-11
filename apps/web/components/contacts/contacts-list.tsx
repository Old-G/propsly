"use client"

import { useCallback } from "react"
import { Users } from "lucide-react"
import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll"
import { useInfiniteList } from "@/lib/hooks/use-infinite-list"
import { fetchContactsPage } from "@/lib/actions/infinite-proposals"

interface Contact {
  id: string
  name: string
  email: string | null
  company: string | null
  phone: string | null
  created_at: string
}

interface ContactsListProps {
  contacts: Contact[]
  totalCount: number
  workspaceId: string
  perPage: number
}

export function ContactsList({
  contacts,
  totalCount,
  workspaceId,
  perPage,
}: ContactsListProps) {
  const fetchMore = useCallback(
    async (offset: number) => {
      const result = await fetchContactsPage({
        workspaceId,
        offset,
        limit: perPage,
      })
      return { items: result.contacts, totalCount: result.totalCount }
    },
    [workspaceId, perPage]
  )

  const { items: allContacts, loadMore, loadingMore, hasMore } = useInfiniteList({
    initialItems: contacts,
    totalCount,
    fetchMore,
  })

  const scrollRef = useInfiniteScroll(loadMore, hasMore, loadingMore)

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

      {allContacts.length === 0 && totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Users className="h-12 w-12 text-[var(--text-tertiary)]" />
          <p className="mt-4 text-[var(--text-secondary)]">No contacts yet</p>
          <p className="text-sm text-[var(--text-tertiary)]">
            Contacts will be created when you add clients to proposals
          </p>
        </div>
      ) : (
        <>
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
                {allContacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-[var(--border-default)] last:border-0 hover:bg-[var(--bg-surface-hover)]">
                    <td className="px-4 py-3 font-medium">{contact.name}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{contact.email ?? "\u2014"}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{contact.company ?? "\u2014"}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{contact.phone ?? "\u2014"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={scrollRef} className="h-1" />
          {loadingMore && (
            <div className="py-4 text-center text-sm text-[var(--text-secondary)]">
              Loading more...
            </div>
          )}

          {/* Count indicator */}
          {allContacts.length > 0 && totalCount > allContacts.length && (
            <p className="text-sm text-[var(--text-secondary)]">
              Showing {allContacts.length} of {totalCount}
            </p>
          )}
        </>
      )}
    </div>
  )
}
