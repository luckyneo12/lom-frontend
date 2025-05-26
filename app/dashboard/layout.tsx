"use client";

import DashboardSidebar from "@/components/DashboardSidebar";
import { FaHome, FaBlog, FaTrash, FaFolder, FaProjectDiagram, FaCog } from 'react-icons/fa';

const sidebarItems = [
  { name: 'Dashboard', href: '/dashboard', icon: FaHome },
  { name: 'Blogs', href: '/dashboard/blogs', icon: FaBlog },
  { name: 'Deleted Blogs', href: '/dashboard/deleted-blogs', icon: FaTrash },
  { name: 'Categories', href: '/dashboard/categories', icon: FaFolder },
  { name: 'Projects', href: '/dashboard/projects', icon: FaProjectDiagram },
  { name: 'Settings', href: '/dashboard/settings', icon: FaCog },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="w-64">
        <DashboardSidebar />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
