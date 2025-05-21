"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileText, FolderOpen, Home, ImageIcon, Settings, Users, LayoutGrid } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Blog",
    href: "/dashboard/blog",
    icon: FileText,
  },
  {
    title: "Sections",
    href: "/dashboard/sections",
    icon: LayoutGrid,
  },
  {
    title: "Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    title: "Categories",
    href: "/categories",
    icon: FolderOpen,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="border-r bg-muted/40 md:w-64">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-xl">BlogDash</span>
        </Link>
      </div>
      <div className="py-4">
        <nav className="grid gap-1 px-2">
          {sidebarLinks.map((link) => (
            <Button
              key={link.href}
              variant={pathname === link.href ? "secondary" : "ghost"}
              className={cn("justify-start gap-2", pathname === link.href ? "bg-secondary" : "hover:bg-muted")}
              asChild
            >
              <Link href={link.href}>
                <link.icon className="h-4 w-4" />
                {link.title}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </div>
  )
}
