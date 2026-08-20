import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BonusesTableBody } from "./BonusesTableBody";

export function BonusesTable() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow>
            <TableHead className="text-xs font-bold">Employee</TableHead><TableHead className="text-xs font-bold">Bonus Type</TableHead><TableHead className="text-xs font-bold">Bonus Plan Title</TableHead>
            <TableHead className="text-xs font-bold">Payout Amount</TableHead><TableHead className="text-xs font-bold">Status</TableHead><TableHead className="text-right text-xs font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <BonusesTableBody />
      </Table>
    </div>
  );
}
