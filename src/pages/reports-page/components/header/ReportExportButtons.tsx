import { FileSpreadsheet, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReportExportButtons({ onExport }: { onExport: (format: string) => void }) {
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => onExport("CSV")} className="text-xs h-9 gap-1.5 border-border/60 bg-secondary/30">
        <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
      </Button>
      <Button size="sm" onClick={() => onExport("PDF")} className="text-xs h-9 gap-1.5 gradient-bg text-primary-foreground font-bold">
        <Download className="w-3.5 h-3.5" /> Export PDF
      </Button>
    </>
  );
}
