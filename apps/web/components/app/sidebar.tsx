"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { navItems, settingsNavItem } from "@/lib/navigation"

interface SidebarProps {
  workspace: {
    id: string
    name: string
    logo_url: string | null
  }
}

export function AppSidebar({ workspace }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-[var(--border-default)] bg-[var(--bg-surface)] lg:flex lg:flex-col">
      {/* Workspace header */}
      <div className="flex h-14 items-center gap-3 border-b border-[var(--border-default)] px-4">
        {workspace.logo_url ? (
          <img
            src={workspace.logo_url}
            alt={workspace.name}
            className="h-7 w-7 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent)] text-xs font-bold text-[var(--text-inverse)]">
            {workspace.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="truncate text-sm font-medium">{workspace.name}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
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
      </nav>

      {/* Settings at bottom */}
      <div className="border-t border-[var(--border-default)] p-3">
        <Link
          href={settingsNavItem.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
            pathname.startsWith("/settings")
              ? "bg-[var(--accent-muted)] text-[var(--accent)]"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)] hover:text-[var(--text-primary)]"
          )}
        >
          <settingsNavItem.icon className="h-4 w-4" />
          {settingsNavItem.label}
        </Link>
      </div>
    </aside>
  )
}
