"use client";
import React from "react";
import { PlusIcon, FolderIcon, ListIcon } from "@/icons";

export const QuickActionButtons = () => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* New Document Button */}
        <button className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-light-300 hover:bg-blue-light-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-blue-light-700 dark:hover:bg-blue-light-500/10">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-light-100 rounded-lg dark:bg-blue-light-500/15">
            <PlusIcon className="text-blue-light-600 size-5 dark:text-blue-light-400" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-800 text-sm dark:text-white/90">
              New Document
            </p>
            <span className="text-gray-500 text-xs dark:text-gray-400">
              Create
            </span>
          </div>
        </button>

        {/* Open Library Button */}
        <button className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-brand-300 hover:bg-brand-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-brand-700 dark:hover:bg-brand-500/10">
          <div className="flex items-center justify-center w-10 h-10 bg-brand-100 rounded-lg dark:bg-brand-500/15">
            <FolderIcon className="text-brand-600 size-5 dark:text-brand-400" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-800 text-sm dark:text-white/90">
              Open Library
            </p>
            <span className="text-gray-500 text-xs dark:text-gray-400">
              Browse
            </span>
          </div>
        </button>

        {/* Open History Button */}
        <button className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-success-300 hover:bg-success-50 dark:border-gray-800 dark:bg-white/[0.03] dark:hover:border-success-700 dark:hover:bg-success-500/10">
          <div className="flex items-center justify-center w-10 h-10 bg-success-100 rounded-lg dark:bg-success-500/15">
            <ListIcon className="text-success-600 size-5 dark:text-success-400" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-800 text-sm dark:text-white/90">
              Open History
            </p>
            <span className="text-gray-500 text-xs dark:text-gray-400">
              View all
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

