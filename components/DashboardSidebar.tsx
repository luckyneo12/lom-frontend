"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  FolderTree,
  Layers,
  Settings,
  Users,
  Tag,
  BookOpen,
  Image,
  FileArchive,
  Briefcase,
  LayoutGrid,
  Archive
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Project Categories",
    path: "/dashboard/project-categories",
    icon: FolderTree,
  },
  {
    title: "Projects",
    path: "/dashboard/create-project",
    icon: Briefcase,
  },
  {
    title: "Categories",
    path: "/dashboard/categories",
    icon: Layers,
  },
  {
    title: "Sections",
    path: "/dashboard/sections",
    icon: LayoutGrid,
  },
 


 
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="pb-12 min-h-screen border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Admin Panel
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 