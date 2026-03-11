"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { searchContacts } from "@/lib/actions/contacts"

interface Contact {
  id: string
  name: string
  email: string | null
  company: string | null
}

interface ClientAutocompleteProps {
  workspaceId: string
  id: string
  name: string
  type?: string
  defaultValue: string
  placeholder?: string
  className?: string
  onSelectContact?: (contact: Contact) => void
}

export function ClientAutocomplete({
  workspaceId,
  id,
  name,
  type,
  defaultValue,
  placeholder,
  className,
  onSelectContact,
}: ClientAutocompleteProps) {
  const [value, setValue] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<Contact[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleChange(newValue: string) {
    setValue(newValue)

    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (newValue.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      const result = await searchContacts(workspaceId, newValue)
      setSuggestions(result.contacts)
      setShowSuggestions(result.contacts.length > 0)
    }, 300)
  }

  function handleSelect(contact: Contact) {
    setValue(name === "client_name" ? contact.name : name === "client_email" ? (contact.email ?? "") : (contact.company ?? ""))
    setShowSuggestions(false)
    onSelectContact?.(contact)
  }

  return (
    <div ref={containerRef} className="relative">
      <Input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        placeholder={placeholder}
        className={className}
        autoComplete="off"
      />
      {showSuggestions && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-lg overflow-hidden">
          {suggestions.map((contact) => (
            <button
              key={contact.id}
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--bg-surface-hover)] transition-colors"
              onClick={() => handleSelect(contact)}
            >
              <span className="font-medium">{contact.name}</span>
              {contact.email && (
                <span className="ml-2 text-[var(--text-tertiary)]">{contact.email}</span>
              )}
              {contact.company && (
                <span className="ml-2 text-[var(--text-tertiary)]">({contact.company})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
