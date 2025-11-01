import type { Metadata } from "next";
import React from "react";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { QuickActionButtons } from "@/components/dashboard/QuickActionButtons";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";

export const metadata: Metadata = {
  title: "LegalDesk Dashboard | Home",
  description: "Home dashboard for quick entry, counts and quick actions",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Top Metrics */}
      <div className="col-span-12">
        <DashboardMetrics />
      </div>

      {/* Quick Actions */}
      <div className="col-span-12">
        <QuickActionButtons />
      </div>

      {/* Recent Activity */}
      <div className="col-span-12">
        <RecentActivityFeed />
      </div>
    </div>
  );
}
