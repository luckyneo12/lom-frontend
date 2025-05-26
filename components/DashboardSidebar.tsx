"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBlog, FaTrash, FaFolder, FaProjectDiagram, FaCog, FaEnvelope, FaLayerGroup } from 'react-icons/fa';

const sidebarItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: FaHome,
  },
  {
    title: "Blogs",
    path: "/dashboard/blog",
    icon: FaBlog,
  },
  {
    title: "Deleted Blogs",
    path: "/dashboard/deleted-blogs",
    icon: FaTrash,
  },
  {
    title: "Categories",
    path: "/dashboard/categories",
    icon: FaFolder,
  },
  {
    title: "Project Categories",
    path: "/dashboard/project-categories",
    icon: FaLayerGroup,
  },
 
  {
    title: " Project",
    path: "/dashboard/create-project",
    icon: FaProjectDiagram,
  },
  {
    title: "Sections",
    path: "/dashboard/sections",
    icon: FaLayerGroup,
  },
  {
    title: "Contact",
    path: "/dashboard/contact",
    icon: FaEnvelope,
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen bg-white border-r">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-yellow-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 