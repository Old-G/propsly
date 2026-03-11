"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Bell, Eye, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions/notifications"
import type { NotificationItem } from "@/lib/actions/notifications"

interface NotificationDropdownProps {
  notifications: NotificationItem[]
  unreadCount: number
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export function NotificationDropdown({ notifications, unreadCount }: NotificationDropdownProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleNotificationClick(notification: NotificationItem) {
    if (!notification.read) {
      startTransition(async () => {
        await markNotificationRead(notification.id)
      })
    }
    if (notification.proposalId) {
      router.push(`/proposals/${notification.proposalId}`)
    }
  }

  function handleMarkAllRead() {
    startTransition(async () => {
      await markAllNotificationsRead()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center p-0 text-[10px]">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-3 py-2">
          <DropdownMenuLabel className="p-0 text-sm">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-[var(--accent)]"
              onClick={handleMarkAllRead}
              disabled={isPending}
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-[var(--text-tertiary)]">
              No notifications yet
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.button
                  key={notification.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex w-full items-start gap-3 px-3 py-3 text-left hover:bg-[var(--bg-surface-hover)] transition-colors ${
                    !notification.read ? "bg-[var(--accent-muted)]" : ""
                  }`}
                >
                  <Eye className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--text-tertiary)]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2">{notification.message}</p>
                    <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                      {timeAgo(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
