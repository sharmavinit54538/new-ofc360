import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReimbursementsTableBody } from "./ReimbursementsTableBody";

export function ReimbursementsTable() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow>
            <TableHead className="text-xs font-bold">Employee</TableHead><TableHead className="text-xs font-bold">Category</TableHead><TableHead className="text-xs font-bold">Description</TableHead>
            <TableHead className="text-xs font-bold">Claim Amount</TableHead><TableHead className="text-xs font-bold">Submitted Date</TableHead><TableHead className="text-xs font-bold">Status</TableHead><TableHead className="text-right text-xs font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <ReimbursementsTableBody />
      </Table>
    </div>
  );
}
