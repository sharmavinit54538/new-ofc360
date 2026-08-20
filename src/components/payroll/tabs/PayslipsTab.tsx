import { motion } from "framer-motion";
import { Send, Loader2, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePayrollContext } from "../PayrollContext";

export function PayslipsTab() {
  const {
    handleBulkEmailPayslips,
    isEmailingPayslips,
    isPayslipsLoading,
    payslipsList,
    fmt,
    handleDownloadPayslip,
  } = usePayrollContext();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Digital Payslips Repository</h2>
          <p className="text-xs text-muted-foreground">Password-protected PDF payslips generated per employee.</p>
        </div>
        <Button
          onClick={handleBulkEmailPayslips}
          disabled={isEmailingPayslips}
          className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5"
        >
          {isEmailingPayslips ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Bulk Email Payslips
        </Button>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold">Employee</TableHead>
              <TableHead className="text-xs font-bold">Pay Period</TableHead>
              <TableHead className="text-xs font-bold">Basic + HRA</TableHead>
              <TableHead className="text-xs font-bold">Deductions (PF/TDS)</TableHead>
              <TableHead className="text-xs font-bold">Net In-Hand Salary</TableHead>
              <TableHead className="text-right text-xs font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPayslipsLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-xs">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                  <p className="text-muted-foreground">Fetching payslips from repository...</p>
                </TableCell>
              </TableRow>
            ) : payslipsList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                  <FileText className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                  <p className="font-bold text-sm text-foreground">No payslips generated for this period</p>
                  <p className="text-[11px]">Run payroll in the "Run Payroll" tab to generate employee payslips.</p>
                </TableCell>
              </TableRow>
            ) : (
              payslipsList.map((p: any) => (
                <TableRow key={p.id}>
                  <TableCell className="font-bold text-xs text-foreground">
                    {p.employee_name || p.employeeName || "Employee"}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {p.pay_period_start ? `${p.pay_period_start} to ${p.pay_period_end}` : `${p.month || "June"} ${p.year || 2026}`}
                  </TableCell>
                  <TableCell className="text-xs font-mono">
                    {fmt(p.gross_pay || (p.basic || 0) + (p.hra || 0) || 75000)}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-destructive">
                    -{fmt(p.total_deductions || (p.pfDeduction || 0) + (p.tdsDeduction || 0) || 8500)}
                  </TableCell>
                  <TableCell className="text-xs font-mono font-bold text-emerald-500">
                    {fmt(p.net_pay || p.netSalary || 66500)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadPayslip(p.id, p.employee_name || p.employeeName)}
                      className="h-7 text-xs gap-1 border-border/60"
                    >
                      <Download className="w-3 h-3" /> PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
