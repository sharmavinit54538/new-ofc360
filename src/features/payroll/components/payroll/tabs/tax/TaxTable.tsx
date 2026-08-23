import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TaxTableBody } from "./TaxTableBody";

export function TaxTable() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow>
            <TableHead className="text-xs font-bold">Tax Declaration Name / Code</TableHead><TableHead className="text-xs font-bold">Regime Selection</TableHead>
            <TableHead className="text-xs font-bold">Sec 80C Declarations</TableHead><TableHead className="text-xs font-bold">Sec 80D Declarations</TableHead>
            <TableHead className="text-xs font-bold">Monthly TDS Deduction</TableHead><TableHead className="text-right text-xs font-bold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TaxTableBody />
      </Table>
    </div>
  );
}
