"use client";
import React from "react";
import { FileIcon, CalenderIcon, GroupIcon } from "@/icons";

export const DashboardMetrics = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
      {/* <!-- Documents Today Card --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-light-100 rounded-xl dark:bg-blue-light-500/15">
          <FileIcon className="text-blue-light-600 size-6 dark:text-blue-light-400" />
        </div>

        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Documents Today
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            12
          </h4>
        </div>
      </div>

      {/* <!-- This Month Card --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-brand-100 rounded-xl dark:bg-brand-500/15">
          <CalenderIcon className="text-brand-600 size-6 dark:text-brand-400" />
        </div>

        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            This Month
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            243
          </h4>
        </div>
      </div>

      {/* <!-- Total Clients Card --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 sm:col-span-2 lg:col-span-1">
        <div className="flex items-center justify-center w-12 h-12 bg-success-100 rounded-xl dark:bg-success-500/15">
          <GroupIcon className="text-success-600 size-6 dark:text-success-400" />
        </div>

        <div className="mt-5">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Clients
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            1,248
          </h4>
        </div>
      </div>
    </div>
  );
};

