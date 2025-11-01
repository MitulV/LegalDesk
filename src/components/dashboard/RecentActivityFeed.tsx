"use client";
import React from "react";
import { FileIcon, TimeIcon } from "@/icons";

// Define the interface for recent activity items
interface ActivityItem {
  id: number;
  documentType: string;
  clientName: string;
  documentNumber: string;
  timestamp: string;
}

// Sample data for recent activity
const recentActivity: ActivityItem[] = [
  {
    id: 1,
    documentType: "Affidavit",
    clientName: "Rajesh Kumar",
    documentNumber: "DOC-2024-001",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    documentType: "NOC",
    clientName: "Priya Sharma",
    documentNumber: "DOC-2024-002",
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    documentType: "Rent Agreement",
    clientName: "Amit Patel",
    documentNumber: "DOC-2024-003",
    timestamp: "6 hours ago",
  },
  {
    id: 4,
    documentType: "Declaration",
    clientName: "Sneha Mehta",
    documentNumber: "DOC-2024-004",
    timestamp: "1 day ago",
  },
  {
    id: 5,
    documentType: "Affidavit",
    clientName: "Mohit Shah",
    documentNumber: "DOC-2024-005",
    timestamp: "2 days ago",
  },
];

export const RecentActivityFeed = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Recent Activity
          </h3>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {recentActivity.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-gray-200 hover:bg-gray-100 dark:border-gray-800 dark:bg-white/[0.02] dark:hover:border-gray-700 dark:hover:bg-white/[0.04]"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-blue-light-100 rounded-lg dark:bg-blue-light-500/15 flex-shrink-0">
              <FileIcon className="text-blue-light-600 size-5 dark:text-blue-light-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-gray-800 text-sm dark:text-white/90">
                  {activity.documentType}
                </p>
                <span className="text-gray-400 text-xs">•</span>
                <span className="text-gray-500 text-xs dark:text-gray-400">
                  {activity.documentNumber}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-gray-600 text-xs dark:text-gray-400">
                  {activity.clientName}
                </p>
                <span className="text-gray-400 text-xs">•</span>
                <div className="flex items-center gap-1">
                  <TimeIcon className="text-gray-400 size-3" />
                  <span className="text-gray-500 text-xs dark:text-gray-400">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

