import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonalHistoryTableRow } from "./PersonalHistoryTableRow";

export function PersonalHistoryTable({ isLoading, items }: { isLoading: boolean; items?: any[] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/40"><TableRow><TableHead className="text-xs font-semibold">Date</TableHead><TableHead className="text-xs font-semibold">Check-In</TableHead><TableHead className="text-xs font-semibold">Check-Out</TableHead><TableHead className="text-xs font-semibold">Working Hours</TableHead><TableHead className="text-xs font-semibold">Face Verification</TableHead><TableHead className="text-xs font-semibold">Status</TableHead></TableRow></TableHeader>
        <TableBody>
          {isLoading ? Array.from({ length: 5 }).map((_, i) => (<TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}</TableRow>)) : items && items.length > 0 ? (
            items.map((row) => <PersonalHistoryTableRow key={row.id} row={row} />)
          ) : <tr><td colSpan={6} className="h-36 text-center text-xs text-muted-foreground">No personal attendance history found.</td></tr>}
        </TableBody>
      </Table>
    </div>
  );
}
