"use client";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, CopyIcon, DownloadIcon, EyeIcon, FileIcon, TimeIcon } from "@/icons";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $createHeadingNode, HeadingNode, HeadingTagType, QuoteNode } from "@lexical/rich-text";
import {
  $createParagraphNode, $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  EditorState,
  FORMAT_TEXT_COMMAND
} from "lexical";
import React, { useEffect, useRef, useState } from "react";

// Import mammoth for DOCX conversion
import mammoth from "mammoth";

interface TemplateVersion {
  id: string;
  version: string;
  createdAt: string;
  content: string;
  metadata: {
    name: string;
    category: string;
    description: string;
  };
}

interface TemplateEditorProps {
   
  onSave: (template: TemplateData) => void;
   
  onClose: () => void;
}

interface TemplateData {
  name: string;
  category: string;
  description: string;
  content: string;
  version: string;
}

// Lexical Configuration
const theme = {
  heading: {
    h1: "text-3xl font-bold mb-4",
    h2: "text-2xl font-bold mb-3",
    h3: "text-xl font-bold mb-2",
  },
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
  },
  list: {
    nested: {
      listitem: "ml-4",
    },
    ol: "list-decimal ml-6",
    ul: "list-disc ml-6",
    listitem: "mb-2",
  },
  quote: "border-l-4 border-gray-300 pl-4 italic my-4",
  paragraph: "mb-2",
};

function onError(error: Error) {
  console.error(error);
}

// Toolbar Component
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: "bold" | "italic" | "underline" | "strikethrough") => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const heading = $createHeadingNode(headingSize);
        const text = selection.getTextContent();
        if (text) {
          heading.append($createTextNode(text));
        }
        selection.insertNodes([heading]);
      }
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2 dark:border-gray-800">
      <button
        type="button"
        onClick={() => formatText("bold")}
        className="rounded px-2 py-1.5 text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        onClick={() => formatText("italic")}
        className="rounded px-2 py-1.5 text-sm italic hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Italic"
      >
        I
      </button>
      <button
        type="button"
        onClick={() => formatText("underline")}
        className="rounded px-2 py-1.5 text-sm underline hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Underline"
      >
        U
      </button>
      <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
      <button
        type="button"
        onClick={() => formatHeading("h1")}
        className="rounded px-2 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Heading 1"
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => formatHeading("h2")}
        className="rounded px-2 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Heading 2"
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => formatHeading("h3")}
        className="rounded px-2 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Heading 3"
      >
        H3
      </button>
    </div>
  );
}

// Plugin to sync content with parent state
function OnChangePluginWrapper({ onChange }: { onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();

  return (
    <OnChangePlugin
      onChange={(editorState: EditorState) => {
        editorState.read(() => {
          const htmlString = $generateHtmlFromNodes(editor, null);
          onChange(htmlString);
        });
      }}
    />
  );
}

// Plugin to load HTML content into editor
function LoadHTMLPlugin({ html, setLoaded }: { html: string | null; setLoaded: () => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (html && html.trim()) {
      // Use setTimeout to ensure editor is ready
      const timeoutId = setTimeout(() => {
        editor.update(() => {
          try {
            const parser = new DOMParser();
            const dom = parser.parseFromString(html, "text/html");
            const nodes = $generateNodesFromDOM(editor, dom);
            const root = $getRoot();
            root.clear();
            root.append(...nodes);
          } catch (error) {
            console.error("Error parsing HTML in LoadHTMLPlugin:", error);
            // Fallback: create a paragraph with the HTML content as text
            const root = $getRoot();
            root.clear();
            const paragraph = $createParagraphNode();
            // Try to extract text from HTML
            const textContent = html.replace(/<[^>]*>/g, "");
            if (textContent.trim()) {
              paragraph.append($createTextNode(textContent));
            }
            root.append(paragraph);
          }
        });
        
        // Call setLoaded after update completes
        setTimeout(() => {
          setLoaded();
        }, 100);
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [html, editor, setLoaded]);

  return null;
}

// Plugin to insert placeholder text
function InsertPlaceholderPlugin({ placeholder, onInserted }: { placeholder: string | null; onInserted: () => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (placeholder) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const textNode = $createTextNode(placeholder);
          selection.insertNodes([textNode]);
        } else {
          const root = $getRoot();
          const paragraph = $createParagraphNode();
          const textNode = $createTextNode(placeholder);
          paragraph.append(textNode);
          root.append(paragraph);
        }
      });
      onInserted();
    }
  }, [placeholder, editor, onInserted]);

  return null;
}

// TemplateEditor component props include function callbacks (onSave, onClose) for client-to-client communication
// These warnings are expected and can be ignored as this is a client component
export const TemplateEditor: React.FC<TemplateEditorProps> = ({ onSave, onClose }) => {
  const [content, setContent] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [versions, setVersions] = useState<TemplateVersion[]>([]);
  const [currentVersion, setCurrentVersion] = useState<TemplateVersion | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [templateCategory, setTemplateCategory] = useState("Affidavit");
  const [templateDescription, setTemplateDescription] = useState("");
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editorHtml, setEditorHtml] = useState<string | null>(null);
  const [placeholderToInsert, setPlaceholderToInsert] = useState<string | null>(null);
  const [placeholderSearch, setPlaceholderSearch] = useState("");

  // Common placeholders for legal documents with categories
  const placeholders = [
    { key: "{{name}}", label: "Person Name", category: "Personal Info" },
    { key: "{{fatherName}}", label: "Father's Name", category: "Personal Info" },
    { key: "{{motherName}}", label: "Mother's Name", category: "Personal Info" },
    { key: "{{dateOfBirth}}", label: "Date of Birth", category: "Personal Info" },
    { key: "{{age}}", label: "Age", category: "Personal Info" },
    { key: "{{gender}}", label: "Gender", category: "Personal Info" },
    { key: "{{maritalStatus}}", label: "Marital Status", category: "Personal Info" },
    { key: "{{address}}", label: "Address", category: "Contact Info" },
    { key: "{{email}}", label: "Email", category: "Contact Info" },
    { key: "{{phoneNumber}}", label: "Phone Number", category: "Contact Info" },
    { key: "{{panNumber}}", label: "PAN Number", category: "Identity Info" },
    { key: "{{aadhaarNumber}}", label: "Aadhaar Number", category: "Identity Info" },
    { key: "{{passportNumber}}", label: "Passport Number", category: "Identity Info" },
    { key: "{{drivingLicenseNumber}}", label: "Driving License Number", category: "Identity Info" },
    { key: "{{occupation}}", label: "Occupation", category: "Professional Info" },
    { key: "{{companyName}}", label: "Company Name", category: "Professional Info" },
    { key: "{{designation}}", label: "Designation", category: "Professional Info" },
    { key: "{{date}}", label: "Current Date", category: "Date & Time" },
    { key: "{{time}}", label: "Current Time", category: "Date & Time" },
    { key: "{{place}}", label: "Place", category: "Location" },
    { key: "{{city}}", label: "City", category: "Location" },
    { key: "{{state}}", label: "State", category: "Location" },
    { key: "{{pincode}}", label: "Pincode", category: "Location" },
    { key: "{{propertyAddress}}", label: "Property Address", category: "Property Info" },
    { key: "{{propertyType}}", label: "Property Type", category: "Property Info" },
    { key: "{{area}}", label: "Area (sq. ft.)", category: "Property Info" },
    { key: "{{amount}}", label: "Amount", category: "Financial Info" },
    { key: "{{duration}}", label: "Duration", category: "Contract Info" },
    { key: "{{startDate}}", label: "Start Date", category: "Contract Info" },
    { key: "{{endDate}}", label: "End Date", category: "Contract Info" },
  ];

  // Get unique categories
  const categories = Array.from(new Set(placeholders.map(p => p.category)));

  // Filter placeholders based on search
  const filteredPlaceholders = placeholders.filter(placeholder =>
    placeholder.label.toLowerCase().includes(placeholderSearch.toLowerCase()) ||
    placeholder.key.toLowerCase().includes(placeholderSearch.toLowerCase()) ||
    placeholder.category.toLowerCase().includes(placeholderSearch.toLowerCase())
  );

  // Group filtered placeholders by category
  const groupedPlaceholders = categories.reduce((acc, category) => {
    const items = filteredPlaceholders.filter(p => p.category === category);
    if (items.length > 0) {
      acc[category] = items;
    }
    return acc;
  }, {} as Record<string, typeof placeholders>);

  // Update preview whenever content changes
  useEffect(() => {
    setPreviewContent(content);
  }, [content]);

  // Lexical editor configuration
  const initialConfig = {
    namespace: "TemplateEditor",
    theme,
    onError,
    nodes: [HeadingNode, ListNode, ListItemNode, QuoteNode],
    editorState: content ? undefined : null,
  };

  // Insert placeholder into editor at cursor position
  const insertPlaceholder = (placeholder: string) => {
    setPlaceholderToInsert(placeholder);
  };

  const handlePlaceholderInserted = () => {
    setPlaceholderToInsert(null);
  };

  const handleHtmlLoaded = () => {
    // Small delay to ensure content is loaded before clearing
    setTimeout(() => {
      setEditorHtml(null);
    }, 100);
  };

  // Handle content change from Lexical
  const handleContentChange = (html: string) => {
    setContent(html);
  };

  // Create a new version
  const createVersion = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name");
      return;
    }

    const newVersion: TemplateVersion = {
      id: Date.now().toString(),
      version: `v${versions.length + 1}.0`,
      createdAt: new Date().toISOString(),
      content,
      metadata: {
        name: templateName,
        category: templateCategory,
        description: templateDescription,
      },
    };

    setVersions([...versions, newVersion]);
    setCurrentVersion(newVersion);
    alert(`Template saved as ${newVersion.version}`);
  };

  // Load a specific version
  const loadVersion = (version: TemplateVersion) => {
    setTemplateName(version.metadata.name);
    setTemplateCategory(version.metadata.category);
    setTemplateDescription(version.metadata.description);
    setCurrentVersion(version);
    
    // Update Lexical editor with the version content
    setEditorHtml(version.content);
    setContent(version.content);
  };

  // Export to PDF (using print functionality)
  const exportToPDF = () => {
    window.print();
  };

  // Copy content to clipboard
  const copyContent = () => {
    navigator.clipboard.writeText(previewContent.replace(/<[^>]*>/g, ""));
    alert("Content copied to clipboard");
  };

  // Handle DOCX import
  const handleDocxImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      // Switch to editor tab first to ensure editor is visible
      if (activeTab !== "editor") {
        setActiveTab("editor");
      }
      
      // Set the converted HTML as content - LoadHTMLPlugin will handle loading it
      setEditorHtml(result.value);
      setContent(result.value);
      
      // Reset file input to allow importing the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      // Handle any warnings
      if (result.messages.length > 0) {
        console.warn("Conversion warnings:", result.messages);
      }
      
    } catch (error) {
      console.error("Error importing DOCX:", error);
      alert("Failed to import DOCX file");
    }
  };

  // Trigger file input
  const triggerDocxImport = () => {
    fileInputRef.current?.click();
  };

  // Handle save
  const handleSave = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name");
      return;
    }

    const template = {
      name: templateName,
      category: templateCategory,
      description: templateDescription,
      content,
      version: currentVersion?.version || `v${versions.length + 1}.0`,
    };

    onSave(template);
  };

  // Custom CSS for preview print
  const printCSS = `
    @media print {
      body {
        margin: 0;
        padding: 20px;
        font-size: 12pt;
        line-height: 1.6;
      }
      .no-print {
        display: none !important;
      }
      h1, h2, h3 {
        page-break-after: avoid;
      }
      p, li {
        page-break-inside: avoid;
      }
    }
  `;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <ChevronLeftIcon className="w-5 h-5" />
                Back to Library
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              {/* DOCX Import */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx"
                onChange={handleDocxImport}
                className="hidden"
              />
              <button
                onClick={triggerDocxImport}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:bg-white/[0.05]"
              >
                <FileIcon className="w-4 h-4" />
                Import DOCX
              </button>

              {/* Export Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={copyContent}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                  title="Copy"
                >
                  <CopyIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={exportToPDF}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:bg-white/[0.05]"
                  title="Export PDF"
                >
                  <DownloadIcon className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={createVersion}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:bg-white/[0.05]"
              >
                <TimeIcon className="w-4 h-4" />
                Save Version
              </button>

              <Button variant="primary" onClick={handleSave}>
                Save Template
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Template Info */}
          <div className="col-span-3 space-y-6">
            {/* Template Metadata */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Template Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </label>
                  <select
                    value={templateCategory}
                    onChange={(e) => setTemplateCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90"
                  >
                    <option value="Affidavit">Affidavit</option>
                    <option value="NOC">NOC</option>
                    <option value="Agreement">Agreement</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Enter description"
                    rows={3}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
                  />
                </div>
              </div>
            </div>

            {/* Placeholders */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                Placeholders
              </h2>
              
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
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
                    value={placeholderSearch}
                    onChange={(e) => setPlaceholderSearch(e.target.value)}
                    placeholder="Search placeholders..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
                  />
                </div>
              </div>

              {/* Placeholders List - Scrollable */}
              <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2">
                {Object.keys(groupedPlaceholders).length > 0 ? (
                  Object.entries(groupedPlaceholders).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {items.map((placeholder) => (
                          <button
                            key={placeholder.key}
                            onClick={() => insertPlaceholder(placeholder.key)}
                            className="group rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 transition-all hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:border-brand-500 dark:hover:bg-brand-500/15 dark:hover:text-brand-400"
                            title={placeholder.key}
                          >
                            <div className="font-medium text-xs">{placeholder.label}</div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
                              {placeholder.key}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                    No placeholders found matching &quot;{placeholderSearch}&quot;
                  </div>
                )}
              </div>
            </div>

            {/* Versions */}
            {versions.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
                  Versions
                </h2>
                
                <div className="space-y-2">
                  {versions.map((version) => (
                    <button
                      key={version.id}
                      onClick={() => loadVersion(version)}
                      className={`w-full rounded-lg border px-4 py-2.5 text-left text-sm transition ${
                        currentVersion?.id === version.id
                          ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-400"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:border-gray-700"
                      }`}
                    >
                      <div className="font-medium">{version.version}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(version.createdAt).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Editor Area */}
          <div className="col-span-9">
            {/* Tab Navigation */}
            <div className="mb-4 flex items-center gap-2 border-b border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setActiveTab("editor")}
                className={`px-4 py-3 text-sm font-medium transition ${
                  activeTab === "editor"
                    ? "border-b-2 border-brand-500 text-brand-600 dark:text-brand-400"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-4 py-3 text-sm font-medium transition ${
                  activeTab === "preview"
                    ? "border-b-2 border-brand-500 text-brand-600 dark:text-brand-400"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <EyeIcon className="w-4 h-4" />
                  Preview
                </div>
              </button>
            </div>

            {/* Editor - Always render to preserve state, hide when preview is active */}
            <div className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${activeTab !== "editor" ? "hidden" : ""}`}>
              <LexicalComposer initialConfig={initialConfig}>
                <ToolbarPlugin />
                <div className="relative">
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable className="min-h-[600px] px-4 py-3 text-sm text-gray-800 focus:outline-none dark:text-white/90 prose max-w-none" />
                    }
                    placeholder={
                      <div className="absolute top-3 left-4 text-sm text-gray-400 pointer-events-none dark:text-gray-500">
                        Start typing your template content...
                      </div>
                    }
                    // @ts-expect-error - LexicalErrorBoundary type mismatch with RichTextPlugin ErrorBoundary prop type definition
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                  <OnChangePluginWrapper onChange={handleContentChange} />
                  <LoadHTMLPlugin html={editorHtml} setLoaded={handleHtmlLoaded} />
                  <InsertPlaceholderPlugin placeholder={placeholderToInsert} onInserted={handlePlaceholderInserted} />
                  <HistoryPlugin />
                  {activeTab === "editor" && <AutoFocusPlugin />}
                  <ListPlugin />
                </div>
              </LexicalComposer>
              <style jsx global>{`
                .editor-input {
                  min-height: 600px;
                }
                .dark .editor-input {
                  color: rgba(255, 255, 255, 0.9);
                }
              `}</style>
            </div>

            {/* Preview */}
            {activeTab === "preview" && (
              <div className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-white/[0.03]">
                <div
                  className="prose max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: previewContent || "<p>No content to preview</p>" }}
                />
                <style dangerouslySetInnerHTML={{ __html: printCSS }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
