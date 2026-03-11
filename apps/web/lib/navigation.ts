import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  Users,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/proposals", label: "Proposals", icon: FileText },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/contacts", label: "Contacts", icon: Users },
]

export const settingsNavItem: NavItem = {
  href: "/settings/workspace",
  label: "Settings",
  icon: Settings,
}
