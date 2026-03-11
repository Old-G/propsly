"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems, settingsNavItem } from "@/lib/navigation"
import { PLAN_LIMITS, type PlanType } from "@/lib/plans"
import { UpgradeModal } from "./upgrade-modal"

const allNavItems = [...navItems, settingsNavItem]

interface MobileNavProps {
  workspaceName: string
  workspaceId: string
  plan: PlanType
  proposalCount: number
}

export function MobileNav({ workspaceName, workspaceId, plan, proposalCount }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const pathname = usePathname()

  const isFreePlan = plan === "free"
  const limit = PLAN_LIMITS[plan].proposals

  return (
    <>
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
            <nav className="fixed left-0 top-14 z-50 w-64 border-r border-[var(--border-default)] bg-[var(--bg-surface)] h-[calc(100vh-3.5rem)] shadow-xl flex flex-col">
              <div className="space-y-1 p-3 flex-1">
                {allNavItems.map((item) => {
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

              {isFreePlan && (
                <div className="mx-3 mb-3 rounded-lg border border-[var(--border-default)] p-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[var(--text-tertiary)]">Free Plan</span>
                    <span className="text-[var(--text-secondary)] font-medium">{proposalCount}/{limit}</span>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false)
                      setUpgradeOpen(true)
                    }}
                    className="flex items-center gap-1.5 text-xs text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                  >
                    <Sparkles className="h-3 w-3" />
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </nav>
          </>
        )}
      </div>

      <UpgradeModal
        open={upgradeOpen}
        onOpenChange={setUpgradeOpen}
        workspaceId={workspaceId}
      />
    </>
  )
}
