"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, LayoutDashboard, FileText, LayoutTemplate, Users, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/proposals", label: "Proposals", icon: FileText },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/settings/workspace", label: "Settings", icon: Settings },
]

interface MobileNavProps {
  workspaceName: string
}

export function MobileNav({ workspaceName }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="text-sm font-medium">{workspaceName}</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <nav className="fixed left-0 top-14 z-50 w-64 border-r border-[var(--border-default)] bg-[var(--bg-surface)] h-[calc(100vh-3.5rem)] shadow-xl">
            <div className="space-y-1 p-3">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                      isActive
                        ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
