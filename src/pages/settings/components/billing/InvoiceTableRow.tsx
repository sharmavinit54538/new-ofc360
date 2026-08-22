import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";

export function InvoiceTableRow({ inv }: { inv: any }) {
  const amt = inv.currency === "INR" || !inv.currency ? `₹${inv.amount.toLocaleString("en-IN")}` : `$${inv.amount.toLocaleString()}`;
  const isPaid = inv.status === "paid";
  return (
    <TableRow key={inv.id} className="text-xs">
      <TableCell className="font-semibold text-foreground">{inv.invoiceNumber}</TableCell>
      <TableCell className="text-muted-foreground">{inv.date || inv.issueDate || "—"}</TableCell>
      <TableCell className="font-semibold text-foreground">{amt}</TableCell>
      <TableCell><Badge variant="outline" className={`text-[10px] capitalize ${isPaid ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}`}>{inv.status}</Badge></TableCell>
      <TableCell className="text-right">
        {inv.downloadUrl || inv.pdfUrl ? <Button size="sm" variant="ghost" asChild className="h-7 px-2 text-xs text-primary gap-1"><a href={inv.downloadUrl || inv.pdfUrl} target="_blank" rel="noreferrer"><Download className="w-3 h-3" /> Download</a></Button> : <Button size="sm" variant="ghost" disabled className="h-7 px-2 text-xs opacity-50 gap-1"><Download className="w-3 h-3" /> Receipt</Button>}
      </TableCell>
    </TableRow>
  );
}