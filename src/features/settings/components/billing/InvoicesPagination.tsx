import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InvoicesPagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
      <span>Page {currentPage} of {totalPages}</span>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="outline" disabled={currentPage <= 1} onClick={() => onPageChange(Math.max(1, currentPage - 1))} className="h-7 px-2 text-xs gap-1"><ChevronLeft className="w-3 h-3" /> Previous</Button>
        <Button size="sm" variant="outline" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)} className="h-7 px-2 text-xs gap-1">Next <ChevronRight className="w-3 h-3" /></Button>
      </div>
    </div>
  );
}
