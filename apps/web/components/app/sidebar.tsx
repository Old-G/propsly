"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems, settingsNavItem } from "@/lib/navigation"
import { PLAN_LIMITS, type PlanType } from "@/lib/plans"
import { UpgradeModal } from "./upgrade-modal"

interface SidebarProps {
  workspace: {
    id: string
    name: string
    logo_url: string | null
    plan: PlanType
  }
  proposalCount: number
}

export function AppSidebar({ workspace, proposalCount }: SidebarProps) {
  const pathname = usePathname()
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  const plan = PLAN_LIMITS[workspace.plan]
  const isFreePlan = workspace.plan === "free"
  const limit = plan.proposals
  const isOverLimit = isFreePlan && proposalCount >= limit

  return (
    <>
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

        {/* Plan usage + upgrade */}
        {isFreePlan && (
          <div className="mx-3 mb-3 rounded-lg border border-[var(--border-default)] p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-tertiary)] uppercase tracking-wider">
                Free Plan
              </span>
              <span className={cn(
                "font-medium",
                isOverLimit ? "text-[var(--warning)]" : "text-[var(--text-secondary)]"
              )}>
                {proposalCount}/{limit}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  isOverLimit ? "bg-[var(--warning)]" : "bg-[var(--accent)]"
                )}
                style={{ width: `${Math.min((proposalCount / limit) * 100, 100)}%` }}
              />
            </div>
            <button
              onClick={() => setUpgradeOpen(true)}
              className="flex items-center gap-1.5 text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
            >
              <Sparkles className="h-3 w-3" />
              Upgrade to Pro
            </button>
          </div>
        )}

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

      <UpgradeModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        workspaceId={workspace.id}
      />
    </>
  )
}
