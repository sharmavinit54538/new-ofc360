import { RefreshCw, Loader2, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InvoicesTable } from "./InvoicesTable";
import { InvoicesPagination } from "./InvoicesPagination";

export function InvoicesCard({ invoices, isLoading, totalPages, page, onPageChange, onRefresh }: {
  invoices: any[]; isLoading: boolean; totalPages: number; page: number; onPageChange: (p: number) => void; onRefresh: () => void;
}) {
  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-border/30 pb-3">
        <div><h3 className="text-base font-bold text-foreground">Invoices & Billing History</h3><p className="text-xs text-muted-foreground">Download receipts and view past tax invoices.</p></div>
        <Button size="sm" variant="outline" onClick={onRefresh} disabled={isLoading} className="text-xs gap-1.5 h-8"><RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh</Button>
      </div>
      {isLoading ? <div className="flex items-center justify-center py-10"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div> : invoices.length === 0 ? <div className="p-8 rounded-xl bg-secondary/10 border border-dashed border-border/50 flex flex-col items-center justify-center text-center space-y-2"><Receipt className="w-8 h-8 text-muted-foreground/50" /><p className="text-xs font-bold text-foreground">No billing history available</p></div> : <div className="space-y-3"><InvoicesTable invoices={invoices} /><InvoicesPagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} /></div>}
    </div>
  );
}
