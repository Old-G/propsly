"use client"

import { useCallback, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Users, Plus, MoreHorizontal, Pencil, Trash2, Search } from "lucide-react"
import { useInfiniteScroll } from "@/lib/hooks/use-infinite-scroll"
import { useInfiniteList } from "@/lib/hooks/use-infinite-list"
import { fetchContactsPage } from "@/lib/actions/infinite-proposals"
import { deleteContact } from "@/lib/actions/contacts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ContactDialog } from "./contact-dialog"
import { toast } from "sonner"

interface Contact {
  id: string
  name: string
  email: string | null
  company: string | null
  phone: string | null
  notes: string | null
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
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleting, startDeleteTransition] = useTransition()

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

  const filteredContacts = searchQuery
    ? allContacts.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.company?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allContacts

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingContact(null)
    setDialogOpen(true)
  }

  const handleDelete = (contact: Contact) => {
    if (!confirm(`Delete "${contact.name}"? This cannot be undone.`)) return

    startDeleteTransition(async () => {
      const result = await deleteContact(contact.id)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Contact deleted")
      }
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Contacts</h1>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Manage your client contacts
          </p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Search */}
      {(allContacts.length > 0 || searchQuery) && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-tertiary)]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="pl-9"
          />
        </div>
      )}

      {allContacts.length === 0 && totalCount === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Users className="h-12 w-12 text-[var(--text-tertiary)]" />
          <p className="mt-4 text-[var(--text-secondary)]">No contacts yet</p>
          <p className="text-sm text-[var(--text-tertiary)]">
            Add your first contact to get started
          </p>
          <Button onClick={handleAdd} variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      ) : filteredContacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Search className="h-12 w-12 text-[var(--text-tertiary)]" />
          <p className="mt-4 text-[var(--text-secondary)]">No contacts match your search</p>
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
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="border-b border-[var(--border-default)] last:border-0 hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer"
                    onClick={() => router.push(`/contacts/${contact.id}`)}
                  >
                    <td className="px-4 py-3 font-medium">{contact.name}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {contact.email ? (
                        <a
                          href={`mailto:${contact.email}`}
                          className="hover:text-[var(--accent)] transition-colors"
                        >
                          {contact.email}
                        </a>
                      ) : (
                        "\u2014"
                      )}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{contact.company ?? "\u2014"}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{contact.phone ?? "\u2014"}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 rounded-md hover:bg-[var(--bg-surface)] transition-colors">
                            <MoreHorizontal className="h-4 w-4 text-[var(--text-tertiary)]" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(contact)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(contact)}
                            className="text-red-400 focus:text-red-400"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
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
          {allContacts.length > 0 && (
            <p className="text-sm text-[var(--text-tertiary)]">
              {totalCount} contact{totalCount !== 1 ? "s" : ""} total
            </p>
          )}
        </>
      )}

      <ContactDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        workspaceId={workspaceId}
        contact={editingContact}
      />
    </div>
  )
}
