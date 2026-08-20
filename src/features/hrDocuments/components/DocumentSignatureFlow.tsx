import React, { useState } from "react";
import {
  FileCheck,
  Send,
  PenTool,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Mail,
  ShieldCheck,
  XCircle,
  RefreshCcw,
} from "lucide-react";
import {
  useRequestSignatureMutation,
  useSignDocumentMutation,
  useGetSignatureStatusQuery,
  useVerifyDocumentMutation,
  useRejectDocumentMutation,
} from "../documentsApi";

interface DocumentSignatureFlowProps {
  initialDocumentId?: string;
}

export const DocumentSignatureFlow: React.FC<DocumentSignatureFlowProps> = ({
  initialDocumentId = "DOC-8821",
}) => {
  const [docId, setDocId] = useState(initialDocumentId);
  const [signerEmail, setSignerEmail] = useState("jane.doe@company.com");
  const [signerName, setSignerName] = useState("Jane Doe");
  const [messageText, setMessageText] = useState("Please review and digitally sign your HR letter.");
  const [signatureData, setSignatureData] = useState("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==");

  // RTK Query endpoints
  const [requestSignature, { isLoading: isRequesting }] = useRequestSignatureMutation();
  const [signDocument, { isLoading: isSigning }] = useSignDocumentMutation();
  const [verifyDoc, { isLoading: isVerifying }] = useVerifyDocumentMutation();
  const [rejectDoc, { isLoading: isRejecting }] = useRejectDocumentMutation();

  const {
    data: sigStatusRes,
    isLoading: isLoadingStatus,
    refetch: refetchStatus,
  } = useGetSignatureStatusQuery(docId, {
    skip: !docId,
    pollingInterval: 10000, // automatic polling every 10 seconds
  });

  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRequestSignature = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await requestSignature({
        id: docId,
        signer_email: signerEmail,
        signer_name: signerName,
        message: messageText,
      }).unwrap();

      setFeedback({
        type: "success",
        text: res.message || `Signature request sent successfully to ${signerEmail}!`,
      });
      refetchStatus();
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err?.data?.message || "Failed to request signature.",
      });
    }
  };

  const handleSign = async () => {
    try {
      const res = await signDocument({
        id: docId,
        signature_data: signatureData,
        signed_by: signerName,
      }).unwrap();

      setFeedback({
        type: "success",
        text: res.message || "Document signed digitally!",
      });
      refetchStatus();
    } catch (err: any) {
      setFeedback({
        type: "error",
        text: err?.data?.message || "Failed to sign document.",
      });
    }
  };

  const handleVerify = async () => {
    try {
      await verifyDoc({ id: docId, notes: "Verified by HR Admin" }).unwrap();
      setFeedback({ type: "success", text: "Document verified & approved by HR Admin!" });
      refetchStatus();
    } catch (err: any) {
      setFeedback({ type: "error", text: err?.data?.message || "Verification failed." });
    }
  };

  const handleReject = async () => {
    try {
      await rejectDoc({ id: docId, reason: "Signature mismatch" }).unwrap();
      setFeedback({ type: "error", text: "Document rejected." });
      refetchStatus();
    } catch (err: any) {
      setFeedback({ type: "error", text: err?.data?.message || "Rejection failed." });
    }
  };

  const statusData = sigStatusRes?.data;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                E-SIGNATURE SYSTEM
              </span>
              <span className="text-xs text-slate-500 font-mono">/api/v1/documents/{docId}/*</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              Generic Document E-Signature & Approval Flow
            </h3>
          </div>
        </div>

        <button
          onClick={() => refetchStatus()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${isLoadingStatus ? "animate-spin" : ""}`} />
          Poll Signature Status
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-700 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-950/50 border-red-300 text-red-700 dark:text-red-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
          {feedback.text}
        </div>
      )}

      {/* 3-Step Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Request Signature */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">Request E-Sign</span>
          </div>

          <form onSubmit={handleRequestSignature} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Target Document ID
              </label>
              <input
                type="text"
                value={docId}
                onChange={(e) => setDocId(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Signer Email
              </label>
              <input
                type="email"
                value={signerEmail}
                onChange={(e) => setSignerEmail(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Signer Full Name
              </label>
              <input
                type="text"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isRequesting}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              {isRequesting ? "Sending Request..." : "Request Signature"}
            </button>
          </form>
        </div>

        {/* Step 2: Sign Digitally */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Recipient Signing</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <div className="text-[11px] text-slate-500 mb-1">Digital Canvas Stamp</div>
              <div className="font-serif italic text-lg text-slate-800 dark:text-slate-200 border-b border-dashed border-slate-400 py-1">
                {signerName || "Jane Doe"}
              </div>
              <span className="text-[10px] text-slate-400 font-mono block mt-1">Hash: 8f9a2e...c01</span>
            </div>

            <button
              onClick={handleSign}
              disabled={isSigning}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-50 transition-all"
            >
              <PenTool className="w-3.5 h-3.5" />
              {isSigning ? "Applying Signature..." : "Sign Document Digitally"}
            </button>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200 transition-all border border-emerald-300 dark:border-emerald-800"
              >
                Verify/Approve
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting}
                className="flex-1 py-1.5 rounded-lg text-[11px] font-medium bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 hover:bg-red-200 transition-all border border-red-300 dark:border-red-800"
              >
                Reject
              </button>
            </div>
          </div>
        </div>

        {/* Step 3: Status & Live Polling */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-4">
          <div className="flex items-center justify-between">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Live Status (Polling)</span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Document ID:</span>
                <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{docId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Status:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  {statusData?.status || "COMPLETED"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Signer:</span>
                <span className="text-xs text-slate-700 dark:text-slate-300">
                  {statusData?.signer_name || signerName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Signed At:</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {statusData?.signed_at ? new Date(statusData.signed_at).toLocaleTimeString() : "Just now"}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-[11px] text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              Polling enabled every 10s via RTK Query <code>useGetSignatureStatusQuery</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};