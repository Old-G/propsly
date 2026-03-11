"use client"

import { useRouter } from "next/navigation"
import { LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/lib/actions/settings"
import { NotificationDropdown } from "@/components/app/notification-dropdown"
import { MobileNav } from "@/components/app/mobile-nav"
import type { NotificationItem } from "@/lib/actions/notifications"
import type { PlanType } from "@/lib/plans"

interface HeaderProps {
  user: {
    email: string
    fullName: string
    avatarUrl: string
  }
  workspace: {
    id: string
    name: string
    plan: PlanType
  }
  unreadCount: number
  notifications: NotificationItem[]
  proposalCount: number
}

export function AppHeader({ user, workspace, unreadCount, notifications, proposalCount }: HeaderProps) {
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push("/login")
  }

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email[0].toUpperCase()

  return (
    <header className="flex h-14 items-center justify-between border-b border-[var(--border-default)] px-4 sm:px-6">
      {/* Mobile nav */}
      <MobileNav
        workspaceName={workspace.name}
        workspaceId={workspace.id}
        plan={workspace.plan}
        proposalCount={proposalCount}
      />
      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        <NotificationDropdown notifications={notifications} unreadCount={unreadCount} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{user.fullName || "User"}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{user.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings/profile")}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/settings/workspace")}>
              <Settings className="mr-2 h-4 w-4" />
              Workspace Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
