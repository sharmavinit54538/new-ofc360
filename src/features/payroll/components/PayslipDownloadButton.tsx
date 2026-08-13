import React from "react";
import { useLazyDownloadPayslipPdfQuery, useLazyBulkDownloadPayslipsQuery } from "../payslipsApi";
import { downloadBlob } from "../utils";

interface PayslipDownloadButtonProps {
  payslipId?: string;
  cycleId?: string;
  variant?: "pdf" | "zip";
  label?: string;
  className?: string;
}

export const PayslipDownloadButton: React.FC<PayslipDownloadButtonProps> = ({
  payslipId,
  cycleId,
  variant = "pdf",
  label,
  className,
}) => {
  const [triggerPdfDownload, { isFetching: isPdfFetching }] = useLazyDownloadPayslipPdfQuery();
  const [triggerZipDownload, { isFetching: isZipFetching }] = useLazyBulkDownloadPayslipsQuery();

  const isDownloading = isPdfFetching || isZipFetching;

  const handleDownload = async () => {
    try {
      if (variant === "pdf") {
        if (!payslipId) {
          console.error("payslipId is required for PDF download");
          return;
        }
        const blob = await triggerPdfDownload(payslipId).unwrap();
        downloadBlob(blob, `payslip_${payslipId}.pdf`);
      } else {
        const blob = await triggerZipDownload({ cycle_id: cycleId }).unwrap();
        downloadBlob(blob, `payslips_export_${cycleId || "bulk"}.zip`);
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const defaultLabel = variant === "pdf" ? "Download PDF Payslip" : "Download Bulk ZIP";

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={
        className ||
        `px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-md flex items-center space-x-2 disabled:opacity-50 ${
          variant === "pdf"
            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/20"
            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
        }`
      }
    >
      {isDownloading ? (
        <>
          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Downloading...</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>{label || defaultLabel}</span>
        </>
      )}
    </button>
  );
};

export default PayslipDownloadButton;
