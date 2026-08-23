import { TableHeader, TableRow, TableHead } from "@/components/ui/table";

export function InvoiceTableHead() {
  return (
    <TableHeader className="bg-secondary/30">
      <TableRow>
        <TableHead className="text-xs font-semibold">Invoice #</TableHead>
        <TableHead className="text-xs font-semibold">Date</TableHead>
        <TableHead className="text-xs font-semibold">Amount</TableHead>
        <TableHead className="text-xs font-semibold">Status</TableHead>
        <TableHead className="text-right text-xs font-semibold">Action</TableHead>
      </TableRow>
    </TableHeader>
  );
}
