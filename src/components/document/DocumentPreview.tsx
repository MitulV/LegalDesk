"use client";
import React from "react";
import { Template } from "@/components/library/TemplateCard";

interface DocumentPreviewProps {
  template: Partial<Template> | null;
  formData: {
    clientName: string;
    documentNumber: string;
    date: string;
    feeAmount: number;
    additionalDetails: string;
  };
  language?: "en" | "gu";
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  template,
  formData,
  language = "en",
}) => {
  if (!template) {
    return (
      <div className="flex items-center justify-center h-full min-h-[600px] rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-white/[0.03]">
        <p className="text-gray-500 dark:text-gray-400">Select a template to preview</p>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format date in Gujarati style (basic)
  const formatDateGujarati = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("gu-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const displayDate =
    language === "gu" ? formatDateGujarati(formData.date) : formatDate(formData.date);

  return (
    <div className="h-full min-h-[600px] rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-y-auto overflow-x-auto">
      {/* Document Preview Container - A4 dimensions for on-screen preview */}
      <div className="w-full flex justify-center items-start p-4">
        <div
          id="document-preview"
          className="print-page bg-white shadow-lg shrink-0"
          style={{
            width: "794px", // 210mm at 96 DPI
            minWidth: "794px", // Ensure minimum width
            minHeight: "723px", 
            padding: "40px", // ≈ 20mm at 96 DPI
            fontSize: "14px",
            lineHeight: 1.5,
          }}
        >
        {/* Document Header */}
        <div className="text-center mb-8 border-b border-gray-300 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {language === "gu" && template.nameGujarati
              ? template.nameGujarati
              : template.name || "Document Title"}
          </h1>
          <p className="text-sm text-gray-600">
            {formData.documentNumber || "DOC-XXXX-XXXX"}
          </p>
        </div>

        {/* Document Body */}
        <div className="space-y-6 text-gray-800 leading-relaxed">
          {/* Date Section */}
          <div className="text-right mb-6">
            <p className="text-sm">
              <span className="font-semibold">Date:</span>{" "}
              {displayDate || "(Select date)"}
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-4">
            <p className="mb-4">
              {language === "en" ? (
                <>
                  I, <span className="font-semibold border-b-2 border-gray-400 px-2">
                    {formData.clientName || "(Client Name)"}
                  </span>
                  , do hereby solemnly affirm and declare on oath as follows:
                </>
              ) : (
                <>
                  હું,{" "}
                  <span className="font-semibold border-b-2 border-gray-400 px-2">
                    {formData.clientName || "(ક્લાયન્ટ નામ)"}
                  </span>
                  , આ શપથ દ્વારા ખાતરી કરું છું અને જાહેર કરું છું:
                </>
              )}
            </p>

            {/* Category-specific content */}
            {template.category === "Affidavit" && (
              <div className="space-y-3">
                <p>
                  {language === "en"
                    ? "This affidavit is being made for identity verification purposes and all information provided is true and correct to the best of my knowledge."
                    : "આ શપથપત્ર ઓળખ ચકાસણી હેતુ માટે બનાવવામાં આવી રહ્યું છે અને આપેલી બધી માહિતી મારા જ્ઞાન મુજબ સાચી અને સચોટ છે."}
                </p>
              </div>
            )}

            {template.category === "NOC" && (
              <div className="space-y-3">
                <p>
                  {language === "en"
                    ? "I hereby issue this No Objection Certificate (NOC) and confirm that I have no objection regarding the matter stated above."
                    : "હું આ કોઈ વાંધો પ્રમાણપત્ર (NOC) જારી કરું છું અને પુષ્ટિ કરું છું કે ઉપર જણાવેલા મામલા પર મારો કોઈ વાંધો નથી."}
                </p>
              </div>
            )}

            {template.category === "Agreement" && (
              <div className="space-y-3">
                <p>
                  {language === "en"
                    ? "This agreement is made and entered into on the date mentioned above between the parties for the purpose stated."
                    : "આ કરાર ઉપર જણાવેલી તારીખે કરાયો છે અને ઉદ્દેશ્ય માટે પક્ષો વચ્ચે પ્રવેશ્યો છે."}
                </p>
              </div>
            )}

            {/* Additional Details */}
            {formData.additionalDetails && (
              <div className="mt-6 pt-4 border-t border-gray-300">
                <p className="font-semibold mb-2">
                  {language === "en" ? "Additional Details:" : "વધારાની વિગતો:"}
                </p>
                <p className="whitespace-pre-wrap">{formData.additionalDetails}</p>
              </div>
            )}

            {/* Fee Section */}
            {formData.feeAmount > 0 && (
              <div className="mt-8 pt-4 border-t border-gray-300">
                <p>
                  <span className="font-semibold">
                    {language === "en" ? "Fee Amount:" : "ફી રકમ:"}
                  </span>{" "}
                  <span className="text-lg">₹{formData.feeAmount}</span>
                </p>
              </div>
            )}
          </div>

          {/* Signature Section */}
          <div className="mt-12 pt-8 border-t-2 border-gray-400">
            <div className="flex justify-between items-end">
              <div className="flex-1">
                <p className="mb-2 font-semibold">
                  {language === "en" ? "Signature:" : "સહી:"}
                </p>
                <div className="h-12 border-b-2 border-gray-400 w-48"></div>
              </div>
              <div className="flex-1 text-right">
                <p className="mb-2 font-semibold">
                  {language === "en" ? "Name:" : "નામ:"}
                </p>
                <p className="border-b-2 border-gray-400 inline-block w-48">
                  {formData.clientName || "(Client Name)"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

