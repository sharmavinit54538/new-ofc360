import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUploadStep8DocumentMutation, useDeleteStep8DocumentMutation } from "@/services/api/employeeOnboardingApi";
import { normalizeError } from "@/services/api/normalizeError";

interface Step8DocumentProps {
  initialData?: {
    documents?: Array<{ id: string; name: string; type: string; status: string }>;
  };
  onSave: () => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export function Step8Document({ initialData, onSave, onBack, isLoading }: Step8DocumentProps) {
  const [uploadedDocs, setUploadedDocs] = useState<Array<{ id: string; name: string; type: string; status: string }>>(
    initialData?.documents || []
  );
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const [uploadDocument] = useUploadStep8DocumentMutation();
  const [deleteDocument] = useDeleteStep8DocumentMutation();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", docType);

    setUploadingDoc(docType);
    try {
      const res = await uploadDocument(formData).unwrap();
      setUploadedDocs((prev) => [...prev, res]);
      toast.success(`${docType} document uploaded successfully!`);
    } catch (err) {
      toast.error(normalizeError(err).message);
    } finally {
      setUploadingDoc(null);
      e.currentTarget.value = "";
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      await deleteDocument(docId).unwrap();
      setUploadedDocs((prev) => prev.filter((d) => d.id !== docId));
      toast.success("Document deleted.");
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  const handleSaveStep8 = async () => {
    if (uploadedDocs.length === 0) {
      toast.error("Please upload at least one mandatory document.");
      return;
    }
    try {
      await onSave();
      toast.success("Step 8 (Document Uploads) completed!");
    } catch (err: any) {
      toast.error(normalizeError(err).message);
    }
  };

  const documentTypes = [
    { type: "aadhaar", label: "Aadhaar Card", icon: FileText },
    { type: "pan", label: "PAN Card", icon: FileText },
    { type: "degree", label: "Degree Certificate", icon: FileText },
    { type: "bank_cheque", label: "Bank Cancelled Cheque", icon: FileText },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div>
        <h3 className="text-xl font-bold text-foreground">Step 8 — Document Verification</h3>
        <p className="text-xs text-muted-foreground">Upload scanned PDFs or images of required onboarding documents.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documentTypes.map(({ type, label }) => (
          <div key={type} className="p-4 rounded-xl bg-secondary/20 border border-border/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">{label}</span>
              <Label
                htmlFor={`doc-${type}`}
                className="cursor-pointer text-[11px] text-primary font-bold hover:underline flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" /> Upload
                <input
                  id={`doc-${type}`}
                  type="file"
                  accept="application/pdf,image/png,image/jpeg"
                  onChange={(e) => handleFileUpload(e, type)}
                  className="hidden"
                />
              </Label>
            </div>
            {uploadingDoc === type && (
              <div className="flex items-center gap-2 text-xs text-primary">
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading...
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Uploaded Files Table */}
      {uploadedDocs.length > 0 ? (
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-foreground">Uploaded Documents ({uploadedDocs.length})</h4>
          <div className="space-y-1.5">
            {uploadedDocs.map((doc) => (
              <div key={doc.id} className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">{doc.name || doc.type}</span>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{doc.status || "Uploaded"}</Badge>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="text-destructive hover:text-destructive/80 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground text-center py-4">No documents uploaded yet.</p>
      )}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="text-xs">Back</Button>
        <Button type="button" onClick={handleSaveStep8} disabled={isLoading} className="gradient-bg gap-2 text-xs">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </div>
    </motion.div>
  );
}