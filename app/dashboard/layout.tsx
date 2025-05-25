"use client";

import DashboardSidebar from "@/components/DashboardSidebar";

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
