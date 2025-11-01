"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FileIcon, EyeIcon } from "@/icons";

export interface Template {
  id: number;
  name: string;
  nameGujarati?: string;
  description: string;
  descriptionGujarati?: string;
  category: "Affidavit" | "NOC" | "Agreement";
  defaultFee: number;
  thumbnail: string;
  language: "en" | "gu";
}

interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  onUseTemplate: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onUseTemplate,
}) => {
  const [language, setLanguage] = useState<"en" | "gu">(template.language);

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "gu" : "en");
  };

  const displayName = language === "gu" && template.nameGujarati 
    ? template.nameGujarati 
    : template.name;
  
  const displayDescription = language === "gu" && template.descriptionGujarati 
    ? template.descriptionGujarati 
    : template.description;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden transition-all hover:shadow-theme-md dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Thumbnail */}
      <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
        <Image
          src={template.thumbnail}
          alt={displayName}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header with Language Toggle */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 text-lg dark:text-white/90 mb-1">
              {displayName}
            </h3>
            <p className="text-gray-500 text-sm dark:text-gray-400 line-clamp-2">
              {displayDescription}
            </p>
          </div>
          
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="ml-2 flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-all hover:border-brand-300 hover:bg-brand-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:border-brand-700 dark:hover:bg-brand-500/10"
          >
            <span>{language === "en" ? "EN" : "GU"}</span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </button>
        </div>

        {/* Category Badge and Fee */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            {template.category}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-gray-500 text-xs dark:text-gray-400">Fee:</span>
            <span className="font-semibold text-gray-800 text-sm dark:text-white/90">
              ₹{template.defaultFee}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPreview(template)}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-white/[0.05]"
          >
            <EyeIcon className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={() => onUseTemplate(template)}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            <FileIcon className="w-4 h-4" />
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
};

