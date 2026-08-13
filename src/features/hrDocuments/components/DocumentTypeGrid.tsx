import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileCheck,
  Award,
  ShieldCheck,
  TrendingUp,
  GraduationCap,
  AlertTriangle,
  UserCheck,
  X,
  Printer,
  Download,
} from "lucide-react";
import { useGenerateMockLetterMutation } from "../letterGeneratorMock";
import { useUploadEmployeeDocumentMutation, useGetCategoriesQuery } from "../documentsApi";
import { MockLetterType, DocumentTypeInfo } from "../types";

export const DOCUMENT_TYPES: DocumentTypeInfo[] = [
  {
    key: "exp_relieving",
    title: "Experience & Relieving Certificate",
    description: "Tied to exit & offboarding flow. Auto-generates final settlement & relieving docs.",
    categoryCode: "EXP_LETTER",
    hasRealGenerator: true,
    generatorType: "exit",
    iconName: "FileCheck",
  },
  {
    key: "appt_offer",
    title: "Appointment & Offer Letter",
    description: "Tied to recruitment offer generation. Real backend recruitment offer flow.",
    categoryCode: "APPT_LETTER",
    hasRealGenerator: true,
    generatorType: "offer",
    iconName: "Award",
  },
  {
    key: "salary_verif",
    title: "Employment & Salary Verification",
    description: "Generic upload/e-sign backing system. Mock AI generator preview available.",
    categoryCode: "SALARY_VERIF",
    hasRealGenerator: false,
    generatorType: "mock",
    mockType: "salary_verification",
    iconName: "ShieldCheck",
  },
  {
    key: "noc",
    title: "No Objection Certificate (NOC)",
    description: "NOC letter for higher study, visa, or external clearance. Upload or preview.",
    categoryCode: "NOC",
    hasRealGenerator: false,
    generatorType: "mock",
    mockType: "noc",
    iconName: "FileText",
  },
  {
    key: "promotion_inc",
    title: "Promotion & Salary Increment Letter",
    description: "Formal appraisal & salary revision document. Upload or preview mock generator.",
    categoryCode: "PROMOTION_LETTER",
    hasRealGenerator: false,
    generatorType: "mock",
    mockType: "promotion_increment",
    iconName: "TrendingUp",
  },
  {
    key: "internship_comp",
    title: "Internship Completion Certificate",
    description: "Certificate of completion for university interns & trainees.",
    categoryCode: "INTERNSHIP_CERT",
    hasRealGenerator: false,
    generatorType: "mock",
    mockType: "internship_completion",
    iconName: "GraduationCap",
  },
  {
    key: "warning_pip",
    title: "Warning / PIP Evaluation Notice",
    description: "Formal performance improvement plan notice and warning letter repository.",
    categoryCode: "WARNING_PIP",
    hasRealGenerator: false,
    generatorType: "mock",
    mockType: "warning_pip",
    iconName: "AlertTriangle",
  },
  {
    key: "bonafide",
    title: "Bonafide Employee Proof",
    description: "Proof of employment for bank loans, passport, or official verification.",
    categoryCode: "BONAFIDE",
    hasRealGenerator: false,
    generatorType: "mock",
    mockType: "bonafide",
    iconName: "UserCheck",
  },
];

interface DocumentTypeGridProps {
  onSelectExitFlow?: () => void;
  onSelectOfferFlow?: () => void;
  employeeId?: string;
  employeeName?: string;
}

export const DocumentTypeGrid: React.FC<DocumentTypeGridProps> = ({
  onSelectExitFlow,
  onSelectOfferFlow,
  employeeId = "EMP-1029",
  employeeName = "Jane Doe",
}) => {
  const [generateMock, { isLoading: isGeneratingMock }] = useGenerateMockLetterMutation();
  const [uploadDocument, { isLoading: isUploading }] = useUploadEmployeeDocumentMutation();
  const { data: categoriesRes } = useGetCategoriesQuery();

  // Modal states
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    title: string;
    html: string;
    docType: string;
  }>({
    isOpen: false,
    title: "",
    html: "",
    docType: "",
  });

  const [uploadModal, setUploadModal] = useState<{
    isOpen: boolean;
    docTypeInfo?: DocumentTypeInfo;
  }>({
    isOpen: false,
  });

  // Upload Form state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadEmpId, setUploadEmpId] = useState(employeeId);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");
  const [uploadErrorMsg, setUploadErrorMsg] = useState("");

  const handleGenerateClick = async (docInfo: DocumentTypeInfo) => {
    if (docInfo.generatorType === "exit") {
      if (onSelectExitFlow) onSelectExitFlow();
      return;
    }

    if (docInfo.generatorType === "offer") {
      if (onSelectOfferFlow) onSelectOfferFlow();
      return;
    }

    if (docInfo.mockType) {
      try {
        const res = await generateMock({
          letterType: docInfo.mockType,
          employeeId,
          employeeName,
        }).unwrap();

        if (res.data) {
          setPreviewModal({
            isOpen: true,
            title: docInfo.title,
            html: res.data.previewHtml,
            docType: docInfo.key,
          });
        }
      } catch (err) {
        console.error("Mock generation failed", err);
      }
    }
  };

  const handleOpenUpload = (docInfo: DocumentTypeInfo) => {
    setUploadTitle(docInfo.title);
    setUploadDescription(`Uploaded ${docInfo.title} document`);
    setUploadModal({ isOpen: true, docTypeInfo: docInfo });
    setUploadSuccessMsg("");
    setUploadErrorMsg("");
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadModal.docTypeInfo) {
      setUploadErrorMsg("Please select a file to upload.");
      return;
    }

    try {
      const categoryId =
        categoriesRes?.data?.find(
          (c) => c.code === uploadModal.docTypeInfo?.categoryCode
        )?.id || "cat_general";

      await uploadDocument({
        file: uploadFile,
        employee_id: uploadEmpId,
        category_id: categoryId,
        title: uploadTitle,
        description: uploadDescription,
        visibility: "PRIVATE",
        status_field: "PENDING",
      }).unwrap();

      setUploadSuccessMsg("Document uploaded successfully to documentsApi generic repository!");
      setTimeout(() => {
        setUploadModal({ isOpen: false });
        setUploadFile(null);
        setUploadSuccessMsg("");
      }, 1500);
    } catch (err: any) {
      setUploadErrorMsg(err?.data?.message || "Failed to upload document.");
    }
  };

  const renderIcon = (iconName: string) => {
    const props = { className: "w-6 h-6 text-indigo-600 dark:text-indigo-400" };
    switch (iconName) {
      case "FileCheck":
        return <FileCheck {...props} />;
      case "Award":
        return <Award {...props} />;
      case "ShieldCheck":
        return <ShieldCheck {...props} />;
      case "TrendingUp":
        return <TrendingUp {...props} />;
      case "GraduationCap":
        return <GraduationCap {...props} />;
      case "AlertTriangle":
        return <AlertTriangle className="w-6 h-6 text-amber-500" />;
      case "UserCheck":
        return <UserCheck {...props} />;
      default:
        return <FileText {...props} />;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 border border-indigo-500/20 text-white shadow-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                HR Letters & Certificates Suite
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Standard Employee Certificates</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Real template generators backed for Offboarding & Offers. Generic e-signature storage enabled for all 8 categories.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 2 Real Backend Generators
            </span>
            <span className="px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> 6 Upload + Mock Preview
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 8 Document Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {DOCUMENT_TYPES.map((doc) => (
          <div
            key={doc.key}
            className="group relative flex flex-col justify-between p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all duration-200"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900">
                  {renderIcon(doc.iconName)}
                </div>
                {doc.hasRealGenerator ? (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    Backend Generator
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                    Upload & E-Sign
                  </span>
                )}
              </div>

              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {doc.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                {doc.description}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
              {doc.hasRealGenerator ? (
                <button
                  onClick={() => handleGenerateClick(doc)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate ({doc.generatorType === "exit" ? "Exit Request" : "Offer Flow"})
                </button>
              ) : (
                <button
                  onClick={() => handleGenerateClick(doc)}
                  disabled={isGeneratingMock}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all border border-slate-700"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  Generate (Mock Preview)
                </button>
              )}

              <button
                onClick={() => handleOpenUpload(doc)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-slate-400" />
                Upload manually
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal for Mock Generator */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    Mock AI Preview
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {previewModal.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  // TODO: backend has no template-fill generator for this doc type yet. Real flow: upload manually via documentsApi.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
                  title="Print Preview"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewModal({ isOpen: false, title: "", html: "", docType: "" })}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body HTML content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950">
              <div
                className="bg-white rounded-lg shadow-md p-4"
                dangerouslySetInnerHTML={{ __html: previewModal.html }}
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500">
                To issue officially, save or upload the final signed copy.
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const docInfo = DOCUMENT_TYPES.find((d) => d.key === previewModal.docType);
                    setPreviewModal({ isOpen: false, title: "", html: "", docType: "" });
                    if (docInfo) handleOpenUpload(docInfo);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
                >
                  <Upload className="w-3.5 h-3.5" /> Save & Upload to Repository
                </button>
                <button
                  onClick={() => setPreviewModal({ isOpen: false, title: "", html: "", docType: "" })}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Upload Document — {uploadModal.docTypeInfo?.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Generic upload endpoint: <code>POST /api/v1/documents/employees</code>
                </p>
              </div>
              <button
                onClick={() => setUploadModal({ isOpen: false })}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              {uploadSuccessMsg && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {uploadSuccessMsg}
                </div>
              )}

              {uploadErrorMsg && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  {uploadErrorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Employee ID *
                </label>
                <input
                  type="text"
                  value={uploadEmpId}
                  onChange={(e) => setUploadEmpId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select File (PDF / Word) *
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  required
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setUploadModal({ isOpen: false })}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {isUploading ? "Uploading..." : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
