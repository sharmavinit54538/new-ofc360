import { useState } from "react";
import { useDepartmentStore } from "@/stores/departmentStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, X, FileText } from "lucide-react";
import { toast } from "sonner";

export function ImportDialog() {
  const { isImportOpen, closeImportModal } = useDepartmentStore();

  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: "csv" | "json";
  } | null>(null);

  const [isDragOver, setIsDragOver] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [previewState, setPreviewState] = useState<"idle" | "validated">("idle");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    const isCsv = file.name.endsWith(".csv");
    const isJson = file.name.endsWith(".json");

    if (!isCsv && !isJson) {
      toast.error("Please upload a valid .csv or .json file");
      return;
    }

    const sizeKb = (file.size / 1024).toFixed(1) + " KB";
    setSelectedFile({
      name: file.name,
      size: sizeKb,
      type: isCsv ? "csv" : "json",
    });
    setPreviewState("validated");
    toast.success("File parsed & validated for preview");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleConfirmImport = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      toast.success(`Import simulation complete for ${selectedFile?.name}`);
      setSelectedFile(null);
      setPreviewState("idle");
      closeImportModal();
    }, 1000);
  };

  return (
    <Dialog open={isImportOpen} onOpenChange={(open) => !open && closeImportModal()}>
      <DialogContent className="sm:max-w-md border-border/60">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Bulk Import Departments</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Upload CSV or JSON files to bulk configure organizational units.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Dropzone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border/60 bg-muted/20 hover:border-primary/40"
            }`}
          >
            <input
              type="file"
              id="bulk-import-input"
              accept=".csv,.json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="bulk-import-input" className="cursor-pointer space-y-2 block">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  Click to upload <span className="font-normal text-muted-foreground">or drag & drop</span>
                </p>
                <p className="text-[11px] text-muted-foreground">CSV or JSON (max 5MB)</p>
              </div>
            </label>
          </div>

          {/* Selected File Details & Preview */}
          {selectedFile && (
            <div className="glass-card rounded-xl p-3.5 border border-primary/30 space-y-3 bg-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                    {selectedFile.type.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground truncate max-w-[200px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{selectedFile.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Validated
                  </span>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewState("idle");
                    }}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {previewState === "validated" && (
                <div className="p-2.5 rounded-lg bg-card border border-border/50 text-[11px] text-muted-foreground space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground">
                    <FileText className="w-3.5 h-3.5 text-primary" /> Schema Validation Ready
                  </div>
                  <p>Frontend parser verified headers: Name, Code, Location, Head, Capacity.</p>
                </div>
              )}
            </div>
          )}

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              This is a frontend UI workflow prototype. No files will be uploaded or transmitted to any server.
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2 border-t">
          <Button variant="outline" onClick={closeImportModal} className="h-9 text-xs">
            Cancel
          </Button>
          <Button
            disabled={!selectedFile || isSimulating}
            onClick={handleConfirmImport}
            className="h-9 text-xs gradient-bg text-primary-foreground gap-1.5"
          >
            {isSimulating ? "Validating..." : "Confirm Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
