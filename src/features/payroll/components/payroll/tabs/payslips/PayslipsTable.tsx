import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PayslipsTableBody } from "./PayslipsTableBody";

export function PayslipsTable() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow>
            <TableHead className="text-xs font-bold">Employee</TableHead><TableHead className="text-xs font-bold">Pay Period</TableHead><TableHead className="text-xs font-bold">Basic + HRA</TableHead>
            <TableHead className="text-xs font-bold">Deductions (PF/TDS)</TableHead><TableHead className="text-xs font-bold">Net In-Hand Salary</TableHead><TableHead className="text-right text-xs font-bold">Action</TableHead>
          </TableRow>
        </TableHeader>
        <PayslipsTableBody />
      </Table>
    </div>
  );
}
