import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyRosterTableRow } from "./CompanyRosterTableRow";

export function CompanyRosterTable({ isLoading, items }: { isLoading: boolean; items?: any[] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40"><TableRow><TableHead className="text-xs font-semibold">Employee</TableHead><TableHead className="text-xs font-semibold">Department</TableHead><TableHead className="text-xs font-semibold">Date</TableHead><TableHead className="text-xs font-semibold">Check-In</TableHead><TableHead className="text-xs font-semibold">Check-Out</TableHead><TableHead className="text-xs font-semibold">Working Hours</TableHead><TableHead className="text-xs font-semibold">Confidence</TableHead><TableHead className="text-xs font-semibold">Status</TableHead></TableRow></TableHeader>
        <TableBody>
          {isLoading ? Array.from({ length: 5 }).map((_, i) => (<TableRow key={i}>{Array.from({ length: 8 }).map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}</TableRow>)) : items && items.length > 0 ? (
            items.map((row) => <CompanyRosterTableRow key={row.id} row={row} />)
          ) : <tr><td colSpan={8} className="h-36 text-center text-xs text-muted-foreground">No company attendance records found.</td></tr>}
        </TableBody>
      </Table>
    </div>
  );
}
