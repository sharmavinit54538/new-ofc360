import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ComplianceTableBody } from "./ComplianceTableBody";

export function ComplianceTable() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
      <Table>
        <TableHeader className="bg-secondary/40">
          <TableRow>
            <TableHead className="text-xs font-bold">Rule Name / Category</TableHead><TableHead className="text-xs font-bold">Scope / Region</TableHead>
            <TableHead className="text-xs font-bold">Description</TableHead><TableHead className="text-xs font-bold">Effective Date</TableHead><TableHead className="text-right text-xs font-bold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <ComplianceTableBody />
      </Table>
    </div>
  );
}
