"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { FileIcon } from "@/icons";
import { Template } from "@/components/library/TemplateCard";
import { DocumentPreview } from "@/components/document/DocumentPreview";
import { generateLegalPdf } from "@/utils/pdfGenerator";

// Sample template data (in production, this would come from an API/database)
const templatesData: Record<number, Partial<Template>> = {
  1: {
    id: 1,
    name: "Affidavit - Identity Proof",
    category: "Affidavit",
    defaultFee: 100,
  },
  2: {
    id: 2,
    name: "Affidavit - Address Proof",
    category: "Affidavit",
    defaultFee: 100,
  },
  3: {
    id: 3,
    name: "NOC - Property Transfer",
    category: "NOC",
    defaultFee: 200,
  },
  4: {
    id: 4,
    name: "NOC - Employment",
    category: "NOC",
    defaultFee: 150,
  },
  5: {
    id: 5,
    name: "Rent Agreement",
    category: "Agreement",
    defaultFee: 300,
  },
  6: {
    id: 6,
    name: "Sale Agreement",
    category: "Agreement",
    defaultFee: 400,
  },
};

function DocumentCreateContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const templateId = searchParams.get("templateId");
  const [template, setTemplate] = useState<Partial<Template> | null>(null);
  const [language, setLanguage] = useState<"en" | "gu">("en");
  const [formData, setFormData] = useState({
    clientName: "",
    documentNumber: "",
    date: "",
    feeAmount: 0,
    additionalDetails: "",
  });

  // Generate document number
  const generateDocumentNumber = (templateId: string | null) => {
    if (!templateId) return "DOC-XXXX-XXXX";
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `DOC-${year}-${random}`;
  };

  useEffect(() => {
    if (templateId) {
      const selectedTemplate = templatesData[parseInt(templateId)];
      if (selectedTemplate) {
        setTemplate(selectedTemplate);
        // Initialize form data with template defaults
        setFormData((prev) => ({
          ...prev,
          documentNumber: generateDocumentNumber(templateId),
          feeAmount: selectedTemplate.defaultFee || 0,
          date: new Date().toISOString().split("T")[0], // Set today's date
        }));
      } else {
        // Template not found, redirect to library
        router.push("/library");
      }
    } else {
      // No template ID, redirect to library
      router.push("/library");
    }
  }, [templateId, router]);

  if (!template) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading template...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "feeAmount" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Template Info Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white/90 mb-1">
              {template.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                {template.category}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Default Fee:{" "}
                <span className="font-semibold text-gray-800 dark:text-white/90">
                  ₹{template.defaultFee}
                </span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "gu" : "en")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:border-brand-300 hover:bg-brand-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:border-brand-700 dark:hover:bg-brand-500/10"
            >
              <span>{language === "en" ? "English" : "ગુજરાતી"}</span>
            </button>
            <button
              onClick={() => router.push("/library")}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-white/[0.05]"
            >
              <FileIcon className="w-4 h-4" />
              Change Template
            </button>
          </div>
        </div>
      </div>

      {/* Split Screen Layout: Form on Left, Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
        {/* Left Side - Document Creation Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
            Document Details
          </h3>

          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  placeholder="Enter client name"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Number *
                </label>
                <input
                  type="text"
                  name="documentNumber"
                  value={formData.documentNumber}
                  onChange={handleInputChange}
                  placeholder="Auto-generated"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fee Amount
                </label>
                <input
                  type="number"
                  name="feeAmount"
                  value={formData.feeAmount || ""}
                  onChange={handleInputChange}
                  placeholder="Enter fee amount"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Details / Notes
              </label>
              <textarea
                rows={4}
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleInputChange}
                placeholder="Enter any additional details or notes..."
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => router.push("/library")}
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-white/[0.05]"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                  try {
                    // Validate required fields
                    if (!formData.clientName || !formData.date || !formData.documentNumber) {
                      alert("Please fill in all required fields (Client Name, Date, Document Number)");
                      return;
                    }

                    // Validate template exists
                    if (!template) {
                      alert("Template not found. Please select a template.");
                      return;
                    }

                    // Generate and print PDF using pdf-lib
                    await generateLegalPdf({
                      template,
                      formData,
                      language,
                    });
                  } catch (error) {
                    console.error("Error generating PDF:", error);
                    alert("An error occurred while generating the PDF. Please try again.");
                  }
              }}
              className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-brand-600 dark:bg-brand-500 dark:hover:bg-brand-600"
            >
              Generate & Print Document
            </button>
          </div>
        </div>

        {/* Right Side - Live Preview */}
        <div className="lg:sticky lg:top-6 lg:self-start w-full min-w-0">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] mb-4">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
              Live Preview
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Preview updates in real-time as you type
            </p>
          </div>
          <DocumentPreview
            template={template}
            formData={formData}
            language={language}
          />
        </div>
      </div>
    </div>
  );
}

export default function DocumentCreatePage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Create Document" />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          </div>
        }
      >
        <DocumentCreateContent />
      </Suspense>
    </div>
  );
}

