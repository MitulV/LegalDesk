"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/modal";
import { Template } from "./TemplateCard";
import Button from "@/components/ui/button/Button";

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  onUseTemplate: (template: Template) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  onClose,
  template,
  onUseTemplate,
}) => {
  const [language, setLanguage] = useState<"en" | "gu">("en");

  if (!template) return null;

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "gu" : "en");
  };

  const displayName =
    language === "gu" && template.nameGujarati
      ? template.nameGujarati
      : template.name;

  const displayDescription =
    language === "gu" && template.descriptionGujarati
      ? template.descriptionGujarati
      : template.description;

  const handleUseTemplate = () => {
    onUseTemplate(template);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl p-6 lg:p-8"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
              {displayName}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{displayDescription}</p>
          </div>
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="ml-4 flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:border-brand-300 hover:bg-brand-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:border-brand-700 dark:hover:bg-brand-500/10"
          >
            <span>{language === "en" ? "English" : "ગુજરાતી"}</span>
            <svg
              className="w-4 h-4"
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

        {/* Template Info */}
        <div className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
            <span className="px-2.5 py-1 rounded-full bg-brand-50 text-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
              {template.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Default Fee:</span>
            <span className="font-semibold text-gray-800 dark:text-white/90">
              ₹{template.defaultFee}
            </span>
          </div>
        </div>

        {/* Preview Image */}
        <div className="relative w-full h-96 bg-gray-100 rounded-xl overflow-hidden dark:bg-gray-800">
          <Image
            src={template.thumbnail}
            alt={displayName}
            fill
            className="object-cover"
          />
        </div>

        {/* Template Preview Content */}
        <div className="p-6 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <h4 className="font-semibold text-gray-800 dark:text-white/90 mb-3">
            Template Preview
          </h4>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This is a preview of the <strong>{displayName}</strong> template.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Click &quot;Use Template&quot; to start creating a document with this
              template. You will be able to fill in all the required details and
              generate your document.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" onClick={handleUseTemplate}>
            Use Template
          </Button>
        </div>
      </div>
    </Modal>
  );
};

