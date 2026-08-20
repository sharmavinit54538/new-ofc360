import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OvertimeTableBody } from "./OvertimeTableBody";

export function OvertimeTable() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow>
            <TableHead className="text-xs font-bold">Employee</TableHead><TableHead className="text-xs font-bold">Overtime Date</TableHead><TableHead className="text-xs font-bold">Hours Rendered</TableHead>
            <TableHead className="text-xs font-bold">Rate Coefficient</TableHead><TableHead className="text-xs font-bold">Calculated Amount</TableHead><TableHead className="text-xs font-bold">Status</TableHead><TableHead className="text-right text-xs font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <OvertimeTableBody />
      </Table>
    </div>
  );
}
