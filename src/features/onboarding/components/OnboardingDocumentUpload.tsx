import React, { useState } from "react";
import {
  useUploadStep8DocumentMutation,
  useDeleteStep8DocumentMutation,
  useFinalizeStep8DocumentsMutation,
} from "../employeeOnboardingApi";
import { EmployeeStep8Document } from "../types";
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Props {
  documents?: EmployeeStep8Document[];
  onCompleteStep?: () => void;
}

const DOCUMENT_TYPES = [
  { value: "identity_proof", label: "Identity Proof (Passport / Aadhaar / PAN)" },
  { value: "address_proof", label: "Address Proof (Utility Bill / Rent Agreement)" },
  { value: "education_certificate", label: "Highest Education Degree / Certificate" },
  { value: "bank_proof", label: "Bank Passbook / Cancelled Cheque" },
  { value: "prior_employment_relieving", label: "Previous Employment Relieving Letter" },
  { value: "tax_document", label: "Tax Declaration / Form 16" },
];

export const OnboardingDocumentUpload: React.FC<Props> = ({
  documents = [],
  onCompleteStep,
}) => {
  const [selectedDocType, setSelectedDocType] = useState<string>("identity_proof");
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [uploadDocument, { isLoading: isUploading }] =
    useUploadStep8DocumentMutation();
  const [deleteDocument, { isLoading: isDeleting }] =
    useDeleteStep8DocumentMutation();
  const [finalizeDocuments, { isLoading: isFinalizing }] =
    useFinalizeStep8DocumentsMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileToUpload(e.target.files[0]);
      setUploadError(null);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileToUpload) {
      setUploadError("Please select a file to upload");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("document_type", selectedDocType);

      await uploadDocument(formData).unwrap();
      setFileToUpload(null);
      setUploadError(null);
    } catch (err: any) {
      setUploadError(
        err?.data?.message || "Failed to upload document. Please try again."
      );
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteDocument(docId).unwrap();
    } catch (err: any) {
      setUploadError(err?.data?.message || "Failed to delete document.");
    }
  };

  const handleFinalize = async () => {
    try {
      await finalizeDocuments({ all_documents_submitted: true }).unwrap();
      if (onCompleteStep) {
        onCompleteStep();
      }
    } catch (err: any) {
      setUploadError(err?.data?.message || "Failed to finalize documents.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Action Required
          </span>
        );
      case "uploaded":
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" /> Under Verification
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              Upload Verification Documents
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Step 8 of 9
              </span>
            </h3>
            <p className="text-sm text-slate-400">
              Provide required identification and compliance verification files.
            </p>
          </div>
        </div>

        {uploadError && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {uploadError}
          </div>
        )}

        {/* File Upload Form */}
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Document Type
              </label>
              <select
                value={selectedDocType}
                onChange={(e) => setSelectedDocType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {DOCUMENT_TYPES.map((dt) => (
                  <option key={dt.value} value={dt.value}>
                    {dt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Select File (PDF, PNG, JPG up to 10MB)
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-400 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!fileToUpload || isUploading}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all shadow-md shadow-indigo-950/30 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Upload Document
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
        <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          Uploaded Documents ({documents.length})
        </h4>

        {documents.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-800 rounded-lg">
            No documents uploaded yet. Select a document type above and upload files.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60 border border-slate-800/80 rounded-lg overflow-hidden">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-slate-950/40 flex items-center justify-between hover:bg-slate-950/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-800/60 text-slate-300 rounded-lg">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200">
                      {doc.name}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                      <span className="capitalize">{doc.document_type.replace(/_/g, " ")}</span>
                      {doc.uploaded_at && (
                        <>
                          <span>•</span>
                          <span>{doc.uploaded_at}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(doc.status)}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={isDeleting}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleFinalize}
            disabled={isFinalizing || documents.length === 0}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-indigo-950/40"
          >
            {isFinalizing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue to Step 9 <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
