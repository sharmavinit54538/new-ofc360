import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, ShieldCheck, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDocumentStore } from "@/stores/documentStore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function EmployeeDocumentsPage() {
  const { documents } = useDocumentStore();
  const { user } = useAuth();

  // Filter documents assigned to current logged-in employee
  const myDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(user?.name.toLowerCase() || "") ||
    d.author === user?.name
  );

  const handleDownload = (docName: string) => {
    const textContent = `OFC360 EMPLOYEE DOCUMENT STATEMENT\n===================================\nEmployee: ${user?.name || "Employee"}\nDocument: ${docName}\nStatus: Verified\n===================================`;
    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = docName;
    link.click();
    toast.success(`Downloaded "${docName}"`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <span>My Personal Document Vault</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Access employment contracts, ID proofs, tax forms, and certificates assigned to your account.
          </p>
        </div>
      </div>

      {/* Document Library */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">Assigned Personal Records</h3>

        {myDocs.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
            <FolderOpen className="w-8 h-8 mx-auto text-muted-foreground/40" />
            <p className="font-bold text-sm text-foreground">No personal documents assigned yet</p>
            <p className="text-xs text-muted-foreground">Your verified contracts and certificates will appear here once issued by HR.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl border border-border/60 bg-secondary/20 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-foreground truncate max-w-[200px]">{doc.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{doc.category} · {doc.updatedAt}</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(doc.name)}
                  className="h-8 text-xs gap-1.5 border-border/70"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
