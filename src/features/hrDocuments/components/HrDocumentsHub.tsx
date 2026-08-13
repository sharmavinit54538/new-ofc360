import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import {
  setActiveCategory,
  setDocumentFilters,
} from "../hrDocumentsUiSlice";
import { DocumentTypeGrid } from "./DocumentTypeGrid";
import { ExitDocumentsPanel } from "./ExitDocumentsPanel";
import { DocumentSignatureFlow } from "./DocumentSignatureFlow";
import {
  useGetEmployeeDocumentsQuery,
  useGetCategoriesQuery,
  useLazyDownloadEmployeeDocumentQuery,
} from "../documentsApi";
import {
  FileText,
  Filter,
  Search,
  Download,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building,
  User,
  Sparkles,
  Layers,
} from "lucide-react";

export const HrDocumentsHub: React.FC = () => {
  const dispatch = useDispatch();
  const uiState = useSelector((state: RootState) => state.hrDocumentsUi);
  const [activeTab, setActiveTab] = useState<"grid" | "exit_flow" | "signature_flow" | "all_documents">("grid");

  // Fetch document categories and employee documents
  const { data: categoriesRes } = useGetCategoriesQuery();
  const { data: documentsRes, isLoading: isLoadingDocs } = useGetEmployeeDocumentsQuery(
    uiState.documentFilters
  );
  const [triggerDownload] = useLazyDownloadEmployeeDocumentQuery();

  const handleDownload = async (docId: string, title: string) => {
    try {
      const blob = await triggerDownload(docId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Failed to download document blob", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 p-6 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" /> HR Letters & Certificates Hub
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Document Center & Certification Engine
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated offboarding generators, recruitment offer integrations, and generic e-signature repository.
          </p>
        </div>

        {/* View switcher tabs */}
        <div className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-900 rounded-xl border border-slate-300/60 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("grid")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "grid"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Certificate Cards (8 Types)
          </button>
          <button
            onClick={() => setActiveTab("exit_flow")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "exit_flow"
                ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Exit Documents Generator
          </button>
          <button
            onClick={() => setActiveTab("signature_flow")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "signature_flow"
                ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            E-Signature & Verifications
          </button>
          <button
            onClick={() => setActiveTab("all_documents")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "all_documents"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Document Repository
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === "grid" && (
        <DocumentTypeGrid
          onSelectExitFlow={() => setActiveTab("exit_flow")}
          onSelectOfferFlow={() => alert("Redirecting to Recruitment Offer Letter flow (/applications/{id}/offer)...")}
        />
      )}

      {activeTab === "exit_flow" && <ExitDocumentsPanel />}

      {activeTab === "signature_flow" && <DocumentSignatureFlow />}

      {activeTab === "all_documents" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Employee Document Repository (`/api/v1/documents/employees`)
            </h3>

            {/* Filters */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={uiState.documentFilters.search || ""}
                  onChange={(e) => dispatch(setDocumentFilters({ search: e.target.value }))}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>

              <select
                value={uiState.documentFilters.status || ""}
                onChange={(e) => dispatch(setDocumentFilters({ status: e.target.value || undefined }))}
                className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-none"
              >
                <option value="">All Statuses</option>
                <option value="VERIFIED">Verified</option>
                <option value="PENDING">Pending</option>
                <option value="SIGNED">Signed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Document Title</th>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {isLoadingDocs ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      Loading documents...
                    </td>
                  </tr>
                ) : documentsRes?.data && documentsRes.data.length > 0 ? (
                  documentsRes.data.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/60 transition-colors">
                      <td className="p-3 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        {doc.title}
                      </td>
                      <td className="p-3">{doc.employee_name || doc.employee_id || "EMP-1029"}</td>
                      <td className="p-3 font-mono text-[11px]">{doc.category_code || "GENERAL"}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {doc.status}
                        </span>
                      </td>
                      <td className="p-3">{new Date(doc.created_at || Date.now()).toLocaleDateString()}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDownload(doc.id, doc.title)}
                          className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 font-semibold text-[11px] inline-flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" /> Download Blob
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      No documents found matching current filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
