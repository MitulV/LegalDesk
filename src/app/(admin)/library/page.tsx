import type { Metadata } from "next";
import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { TemplateLibrary } from "@/components/library/TemplateLibrary";

export const metadata: Metadata = {
  title: "Template Library | LegalDesk",
  description: "Browse and select from our collection of legal document templates",
};

export default function LibraryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Template Library" />
      <TemplateLibrary />
    </div>
  );
}

