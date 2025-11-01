"use client";
import Button from "@/components/ui/button/Button";
import { FolderIcon, PlusIcon } from "@/icons";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { Template, TemplateCard } from "./TemplateCard";
import { TemplateEditor } from "./TemplateEditor";
import { TemplatePreviewModal } from "./TemplatePreviewModal";

// Sample template data
const templatesData: Template[] = [
  {
    id: 1,
    name: "Affidavit - Identity Proof",
    nameGujarati: "શપથપત્ર - ઓળખ પુરાવો",
    description: "Standard affidavit for identity verification purposes",
    descriptionGujarati: "ઓળખ ચકાસણી માટે પ્રમાણભૂત શપથપત્ર",
    category: "Affidavit",
    defaultFee: 100,
    thumbnail: "/images/cards/card-01.png",
    language: "en",
  },
  {
    id: 2,
    name: "Affidavit - Address Proof",
    nameGujarati: "શપથપત્ર - સરનામું પુરાવો",
    description: "For address verification in various official procedures",
    descriptionGujarati: "વિવિધ સત્તાવાર પ્રક્રિયાઓમાં સરનામું ચકાસણી માટે",
    category: "Affidavit",
    defaultFee: 100,
    thumbnail: "/images/cards/card-02.png",
    language: "en",
  },
  {
    id: 3,
    name: "NOC - Property Transfer",
    nameGujarati: "એનઓસી - મિલકત સ્થાનાંતરણ",
    description: "No Objection Certificate for property transfer",
    descriptionGujarati: "મિલકત સ્થાનાંતરણ માટે કોઈ વાંધો પ્રમાણપત્ર",
    category: "NOC",
    defaultFee: 200,
    thumbnail: "/images/cards/card-03.png",
    language: "en",
  },
  {
    id: 4,
    name: "NOC - Employment",
    nameGujarati: "એનઓસી - રોજગારી",
    description: "No Objection Certificate for employment purposes",
    descriptionGujarati: "રોજગારી હેતુઓ માટે કોઈ વાંધો પ્રમાણપત્ર",
    category: "NOC",
    defaultFee: 150,
    thumbnail: "/images/cards/card-01.jpg",
    language: "en",
  },
  {
    id: 5,
    name: "Rent Agreement",
    nameGujarati: "ભાડાની કરાર",
    description: "Standard rent agreement for residential properties",
    descriptionGujarati: "રહેઠાણ મિલકતો માટે પ્રમાણભૂત ભાડાની કરાર",
    category: "Agreement",
    defaultFee: 300,
    thumbnail: "/images/cards/card-02.jpg",
    language: "en",
  },
  {
    id: 6,
    name: "Sale Agreement",
    nameGujarati: "વેચાણ કરાર",
    description: "Property sale agreement template",
    descriptionGujarati: "મિલકત વેચાણ કરાર ટેમ્પ્લેટ",
    category: "Agreement",
    defaultFee: 400,
    thumbnail: "/images/cards/card-03.jpg",
    language: "en",
  },
];

type Category = "All" | "Affidavit" | "NOC" | "Agreement";

export const TemplateLibrary: React.FC = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const categories: Category[] = ["All", "Affidavit", "NOC", "Agreement"];

  // Filter templates based on category and search
  const filteredTemplates = useMemo(() => {
    return templatesData.filter((template) => {
      const matchesCategory =
        selectedCategory === "All" || template.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.nameGujarati &&
          template.nameGujarati.includes(searchQuery)) ||
        (template.descriptionGujarati &&
          template.descriptionGujarati.includes(searchQuery));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleUseTemplate = (template: Template) => {
    // Navigate to document creation page with template ID
    router.push(`/document/create?templateId=${template.id}`);
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setPreviewTemplate(null);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
  };

  const handleSaveTemplate = (template: { name: string; category: string; description: string; descriptionGujarati?: string; content: string; version: string }) => {
    // TODO: Integrate with backend to save template
    console.log("Saving template:", template);
    setIsEditorOpen(false);
  };

  if (isEditorOpen) {
    return <TemplateEditor onSave={handleSaveTemplate} onClose={handleCloseEditor} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
            Template Library
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Browse and select from our collection of legal document templates
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          startIcon={<PlusIcon className="w-5 h-5" />}
          onClick={() => setIsEditorOpen(true)}
        >
          New Template
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Box */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search templates by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400 dark:border-brand-500"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:border-gray-700 dark:hover:bg-white/[0.05]"
              }`}
            >
              {category !== "All" && (
                <FolderIcon className="w-4 h-4" />
              )}
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filteredTemplates.length}{" "}
          {filteredTemplates.length === 1 ? "template" : "templates"} found
        </p>
      </div>

      {/* Template Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onPreview={handlePreview}
              onUseTemplate={handleUseTemplate}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-white/[0.03]">
          <FolderIcon className="mx-auto w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
            No templates found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Preview Modal */}
      <TemplatePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreview}
        template={previewTemplate}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
};

