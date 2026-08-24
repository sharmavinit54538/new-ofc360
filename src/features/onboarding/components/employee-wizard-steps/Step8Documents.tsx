import React, { useState } from "react";
import { Upload, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

interface UploadedDoc {
  id: string;
  name: string;
  type: string;
  status: string;
}

interface Step8DocumentsProps {
  uploadedDocs: UploadedDoc[];
  setUploadedDocs: React.Dispatch<React.SetStateAction<UploadedDoc[]>>;
  isUploadingDoc: boolean;
  isCompletingStep8: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, docType: string) => Promise<void>;
  onDeleteDocument: (docId: string) => Promise<void>;
  onSubmit: () => void;
  onBack: () => void;
}

const REQUIRED_DOCS = ["Aadhaar Card", "PAN Card", "Degree Certificate", "Bank Cancelled Cheque"];

export function Step8Documents({
  uploadedDocs,
  setUploadedDocs,
  isUploadingDoc,
  isCompletingStep8,
  onFileUpload,
  onDeleteDocument,
  onSubmit,
  onBack,
}: Step8DocumentsProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-foreground">Step 8 — Document Verification</h3>
        <p className="text-xs text-muted-foreground">Upload scanned PDFs or images of required onboarding documents.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {REQUIRED_DOCS.map((docType) => (
          <div key={docType} className="p-4 rounded-xl bg-secondary/20 border border-border/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">{docType}</span>
              <Label htmlFor={`doc-${docType}`} className="cursor-pointer text-[11px] text-primary font-bold hover:underline flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload
              </Label>
              <input
                id={`doc-${docType}`}
                type="file"
                accept="application/pdf,image/png,image/jpeg"
                onChange={(e) => onFileUpload(e, docType)}
                className="hidden"
              />
            </div>
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
                <button type="button" onClick={() => onDeleteDocument(doc.id)} className="text-destructive hover:text-destructive/80 p-1">
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
        <Button type="button" variant="outline" onClick={onBack} className="text-xs"><ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back</Button>
        <Button type="button" onClick={onSubmit} disabled={isCompletingStep8 || isUploadingDoc} className="gradient-bg gap-2 text-xs">
          {isCompletingStep8 ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </div>
    </div>
  );
}