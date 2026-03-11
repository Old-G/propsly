"use client"

import { useRouter } from "next/navigation"
import { Bell, LogOut, User, Settings } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { signOut } from "@/lib/actions/settings"

interface HeaderProps {
  user: {
    email: string
    fullName: string
    avatarUrl: string
  }
  workspace: {
    id: string
    name: string
  }
  unreadCount: number
}

export function AppHeader({ user, unreadCount }: HeaderProps) {
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
    <header className="flex h-14 items-center justify-between border-b border-[var(--border-default)] px-6">
      {/* Mobile menu placeholder */}
      <div className="lg:hidden">
        <span className="text-sm font-medium">Propsly</span>
      </div>
      <div className="hidden lg:block" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center p-0 text-[10px]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>

        {/* User menu */}
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
