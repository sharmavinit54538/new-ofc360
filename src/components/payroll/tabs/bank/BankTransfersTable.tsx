import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BankTransfersTableBody } from "./BankTransfersTableBody";

export function BankTransfersTable() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow>
            <TableHead className="text-xs font-bold">Batch ID</TableHead><TableHead className="text-xs font-bold">Bank Partner</TableHead><TableHead className="text-xs font-bold">Batch Reference</TableHead>
            <TableHead className="text-xs font-bold">Transfer Count</TableHead><TableHead className="text-xs font-bold">Total Amount</TableHead><TableHead className="text-xs font-bold">Status</TableHead><TableHead className="text-right text-xs font-bold">Download</TableHead>
          </TableRow>
        </TableHeader>
        <BankTransfersTableBody />
      </Table>
    </div>
  );
}
