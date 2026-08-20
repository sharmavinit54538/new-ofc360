import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdvancesTableBody } from "./AdvancesTableBody";

export function AdvancesTable() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow>
            <TableHead className="text-xs font-bold">Employee</TableHead><TableHead className="text-xs font-bold">Principal Loan</TableHead><TableHead className="text-xs font-bold">Monthly EMI Payout</TableHead>
            <TableHead className="text-xs font-bold">Remaining Balance</TableHead><TableHead className="text-xs font-bold">Tenure Cycle</TableHead><TableHead className="text-xs font-bold">Status</TableHead><TableHead className="text-right text-xs font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <AdvancesTableBody />
      </Table>
    </div>
  );
}
