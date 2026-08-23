import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SalaryProcessingTableBody } from "./SalaryProcessingTableBody";

export function SalaryProcessingTable() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow>
            <TableHead className="text-xs font-bold">Payroll Batch / Pay Cycle</TableHead><TableHead className="text-xs font-bold">Processed Employees</TableHead>
            <TableHead className="text-xs font-bold">Gross Total CTC</TableHead><TableHead className="text-xs font-bold">Net Salary Payout</TableHead>
            <TableHead className="text-xs font-bold">Processed Date</TableHead><TableHead className="text-right text-xs font-bold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <SalaryProcessingTableBody />
      </Table>
    </div>
  );
}
