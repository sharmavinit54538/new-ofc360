import React, { useRef } from "react";
import { UploadCloud, FileCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const ALLOWED_FORMATS = [".pdf", ".docx", ".doc", ".png", ".jpg", ".jpeg", ".tiff"];
const MAX_SIZE_MB = 15;

interface ResumeUploadDropzoneProps {
  file: File | null;
  dragActive: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function ResumeUploadDropzone({
  file,
  dragActive,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileChange,
  onRemoveFile,
  fileInputRef,
}: ResumeUploadDropzoneProps) {
  return (
    <Card className="border-border/60 shadow-md bg-card/60 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-primary" />
          Upload Resume Document
        </CardTitle>
        <CardDescription>
          Supported formats: PDF, DOCX, DOC, JPG, PNG, TIFF (Max {MAX_SIZE_MB}MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-4 ${
            dragActive
              ? "border-primary bg-primary/10 scale-[1.01]"
              : file
              ? "border-emerald-500/50 bg-emerald-500/5"
              : "border-border/80 hover:border-primary/60 hover:bg-secondary/40"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED_FORMATS.join(",")}
            onChange={onFileChange}
            className="hidden"
          />

          {file ? (
            <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shadow-inner">
                <FileCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-base text-foreground max-w-md truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB • {file.type || "Document"}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile();
                }}
                className="mt-2 text-xs text-destructive hover:bg-destructive/10 border-destructive/30"
              >
                Remove & Choose Another
              </Button>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner transition-transform group-hover:scale-110">
                <UploadCloud className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-base text-foreground">
                  Drag and drop your resume here, or <span className="text-primary underline">browse files</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF or DOCX documents produce the fastest and most accurate parsing
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                {ALLOWED_FORMATS.map((ext) => (
                  <span key={ext} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-secondary text-muted-foreground border border-border/40">
                    {ext.toUpperCase()}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}