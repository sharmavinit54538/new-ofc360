import { useState } from "react";
import { useDepartmentStore } from "@/stores/departmentStore";
import { useCreateDepartmentMutation } from "@/services/api/departmentApi";
import { Department } from "@/types/hr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, X, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ParsedDept {
  name: string;
  code?: string;
  head?: string;
  manager?: string;
  location?: string;
  capacity?: number | null;
  budget?: string;
  status?: string;
  description?: string;
}

export function ImportDialog() {
  const { isImportOpen, closeImportModal } = useDepartmentStore();
  const [createDepartmentApi] = useCreateDepartmentMutation();

  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: "csv" | "json";
  } | null>(null);

  const [parsedRows, setParsedRows] = useState<ParsedDept[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  const parseCsvText = (text: string): ParsedDept[] => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/^["']|["']$/g, ""));
    const items: ParsedDept[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
      if (cols.length === 0 || !cols[0]) continue;

      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        row[h] = cols[idx] || "";
      });

      const name = row["name"] || row["department"] || row["department_name"] || row["departmentname"] || cols[0];
      if (!name) continue;

      items.push({
        name,
        code: row["code"] || row["department_code"] || row["departmentcode"] || name.slice(0, 4).toUpperCase(),
        head: row["head"] || row["department_head"] || row["manager"] || "",
        location: row["location"] || row["office"] || "Headquarters",
        capacity: row["capacity"] ? parseInt(row["capacity"], 10) : null,
        budget: row["budget"] || "0",
        status: row["status"] || "Active",
        description: row["description"] || "",
      });
    }

    return items;
  };

  const parseJsonText = (text: string): ParsedDept[] => {
    try {
      const data = JSON.parse(text);
      const arr = Array.isArray(data) ? data : data.departments || data.items || [];
      return arr.map((item: any) => ({
        name: item.name || item.department_name || item.departmentName || "",
        code: item.code || item.department_code || item.departmentCode || "",
        head: item.head || item.headOfDepartment || item.manager || "",
        manager: item.manager || "",
        location: item.location || "Headquarters",
        capacity: item.capacity !== undefined ? item.capacity : null,
        budget: item.budget ? String(item.budget) : "0",
        status: item.status || "Active",
        description: item.description || "",
      })).filter((d: ParsedDept) => !!d.name);
    } catch {
      return [];
    }
  };

  const processFile = (file: File) => {
    const isCsv = file.name.endsWith(".csv");
    const isJson = file.name.endsWith(".json");

    if (!isCsv && !isJson) {
      toast.error("Please upload a valid .csv or .json file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = isCsv ? parseCsvText(text) : parseJsonText(text);

      if (parsed.length === 0) {
        toast.error("No valid department records found in file");
        return;
      }

      setParsedRows(parsed);
      const sizeKb = (file.size / 1024).toFixed(1) + " KB";
      setSelectedFile({
        name: file.name,
        size: sizeKb,
        type: isCsv ? "csv" : "json",
      });
      toast.success(`Parsed ${parsed.length} department records`);
    };
    reader.readAsText(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;

    setIsImporting(true);
    setProgressPercent(0);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < parsedRows.length; i++) {
      const item = parsedRows[i];
      try {
        await createDepartmentApi(item as Partial<Department>).unwrap();
        successCount++;
      } catch (err) {
        console.error("Failed to import department row:", item, err);
        failCount++;
      }
      setProgressPercent(Math.round(((i + 1) / parsedRows.length) * 100));
    }

    setIsImporting(false);

    if (failCount === 0) {
      toast.success(`Successfully imported ${successCount} departments`);
    } else {
      toast.warning(`${successCount} of ${parsedRows.length} departments imported, ${failCount} failed`);
    }

    setSelectedFile(null);
    setParsedRows([]);
    setProgressPercent(0);
    closeImportModal();
  };

  return (
    <Dialog open={isImportOpen} onOpenChange={(open) => !open && !isImporting && closeImportModal()}>
      <DialogContent className="sm:max-w-md border-border/60">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Bulk Import Departments</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Upload CSV or JSON files to bulk create organizational units.
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
              disabled={isImporting}
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
                    <CheckCircle2 className="w-3 h-3" /> {parsedRows.length} rows ready
                  </span>
                  {!isImporting && (
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setParsedRows([]);
                        setProgressPercent(0);
                      }}
                      className="p-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-card border border-border/50 text-[11px] text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-foreground">
                  <FileText className="w-3.5 h-3.5 text-primary" /> Validated Department Schema
                </div>
                <p>Fields detected: Name, Code, Location, Head, Capacity.</p>
              </div>

              {isImporting && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>Importing to backend...</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              )}
            </div>
          )}

          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-700 dark:text-blue-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Each department row will be created in your database and immediately reflected in the department roster.
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2 border-t">
          <Button variant="outline" onClick={closeImportModal} disabled={isImporting} className="h-9 text-xs">
            Cancel
          </Button>
          <Button
            disabled={parsedRows.length === 0 || isImporting}
            onClick={handleConfirmImport}
            className="h-9 text-xs gradient-bg text-primary-foreground gap-1.5"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <span>Import {parsedRows.length > 0 ? `${parsedRows.length} Departments` : ""}</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}