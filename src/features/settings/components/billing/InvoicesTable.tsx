import { Table, TableBody } from "@/components/ui/table";
import { InvoiceTableHead } from "./InvoiceTableHead";
import { InvoiceTableRow } from "./InvoiceTableRow";

export function InvoicesTable({ invoices }: { invoices: any[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/40">
      <Table>
        <InvoiceTableHead />
        <TableBody>
          {invoices.map((inv) => (
            <InvoiceTableRow key={inv.id} inv={inv} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
