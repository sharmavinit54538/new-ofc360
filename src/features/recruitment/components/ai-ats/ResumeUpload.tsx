import React, { useState } from "react";
import { UploadCloud, FileSearch, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ResumeUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  uploadError: string | null;
  setUploadError: (error: string | null) => void;
}

export function ResumeUpload({ file, setFile, isDragging, setIsDragging, uploadError, setUploadError }: ResumeUploadProps) {
  const validateAndSetFile = (f: File) => {
    const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/msword"];
    const ext = f.name.slice(((f.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();

    if (!validTypes.includes(f.type) && !["pdf", "docx", "doc"].includes(ext)) {
      setUploadError("Invalid file type. Please upload a PDF or DOCX resume document.");
      toast.error("Only PDF and DOCX files are supported.");
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit.");
      toast.error("Resume file must be under 10MB.");
      return;
    }

    setFile(f);
    toast.success(`Resume uploaded: ${f.name}`);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setUploadError(null);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 border border-border/60 bg-card space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <UploadCloud className="w-4 h-4 text-primary" /> Step 1: Upload Candidate Resume
        </span>
        <Badge variant="outline" className="text-[10px]">PDF, DOCX supported</Badge>
      </div>

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5 scale-[0.99]"
              : "border-border/80 hover:border-primary/50 bg-secondary/20"
          }`}
        >
          <input
            type="file"
            id="resume-file-input"
            accept=".pdf,.docx,.doc"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="resume-file-input" className="cursor-pointer space-y-2 block">
            <FileSearch className="w-10 h-10 mx-auto text-primary/70 mb-2" />
            <p className="text-sm font-bold text-foreground">Drag & drop candidate resume here</p>
            <p className="text-xs text-muted-foreground">or click to browse from computer (Max 10MB)</p>
          </label>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-secondary/40 border border-border/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-primary-foreground font-bold shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate max-w-[200px]">{file.name}</p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  {(file.size / 1024).toFixed(1)} KB • Ready for Parsing
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setFile(null)}
              className="h-8 text-xs text-rose-500 hover:bg-rose-500/10"
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-rose-500 flex items-center gap-1 font-medium">
          <AlertTriangle className="w-3.5 h-3.5" /> {uploadError}
        </p>
      )}
    </div>
  );
}