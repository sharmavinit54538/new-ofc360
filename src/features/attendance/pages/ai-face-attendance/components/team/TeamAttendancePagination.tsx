import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TeamAttendancePagination({ page, totalPages, setPage }: any) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between p-3 border-t border-border/40 text-xs bg-muted/10">
      <span className="text-muted-foreground">Page {page} of {totalPages}</span>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p: number) => Math.max(1, p - 1))} className="h-7 text-xs"><ChevronLeft className="w-3 h-3" /> Prev</Button>
        <Button size="sm" variant="outline" disabled={page >= totalPages} onClick={() => setPage((p: number) => p + 1)} className="h-7 text-xs">Next <ChevronRight className="w-3 h-3" /></Button>
      </div>
    </div>
  );
}
