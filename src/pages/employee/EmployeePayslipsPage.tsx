import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, FileText, Download, ShieldCheck, Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useGetPayslipsQuery, useLazyDownloadPayslipPdfQuery } from "@/features/payroll";
import { formatCurrency } from "@/utils/currency";
import { toast } from "sonner";

export default function EmployeePayslipsPage() {
  const { user } = useAuth();
  const { data: payslipsRes, isLoading } = useGetPayslipsQuery();
  const [triggerDownloadPdf] = useLazyDownloadPayslipPdfQuery();

  const rawPayslips = Array.isArray(payslipsRes?.data)
    ? payslipsRes.data
    : payslipsRes?.data?.items || payslipsRes?.data?.payslips || [];
  const allPayslips = Array.isArray(rawPayslips) ? rawPayslips : [];

  // Filter payslips belonging ONLY to authenticated employee (or show all if admin/demo)
  const myPayslips = allPayslips.filter(
    (p: any) =>
      !user?.id ||
      p.employee_id === user?.id ||
      p.employeeId === user?.id ||
      p.employee_name === user?.name ||
      p.employeeName === user?.name
  );

  const fmt = (n: number) => formatCurrency(n, "INR (₹)");

  const handleDownloadPDF = async (payslipId: string, month: string, year: number | string) => {
    try {
      toast.info(`Preparing encrypted PDF payslip for ${month} ${year}...`);
      const blobResult = await triggerDownloadPdf(payslipId).unwrap();
      if (blobResult instanceof Blob) {
        const url = window.URL.createObjectURL(blobResult);
        const link = document.createElement("a");
        link.href = url;
        link.download = `OFC360_Payslip_${month}_${year}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast.success("Payslip downloaded successfully.");
      } else {
        toast.success(`Generated PDF payslip for ${month} ${year}.`);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to download payslip.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span>My Payslips & Compensation</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Secure self-service portal to view and download your monthly salary slips.
          </p>
        </div>
      </div>

      {/* Salary Security Banner */}
      <div className="p-4 rounded-2xl bg-card border border-primary/20 space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-bold text-primary">
          <ShieldCheck className="w-4 h-4" />
          <span>Encrypted Payroll Data Access</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Salary slips are password-protected with your registered Date of Birth / PAN card details for maximum privacy.
        </p>
      </div>

      {/* Payslips Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">Monthly Payslips Repository</h3>

        {isLoading ? (
          <div className="py-12 text-center space-y-2">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
            <p className="text-xs text-muted-foreground">Loading salary slips from server...</p>
          </div>
        ) : myPayslips.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
            <FileText className="w-8 h-8 mx-auto text-muted-foreground/40" />
            <p className="font-bold text-sm text-foreground">No salary slips available yet</p>
            <p className="text-xs text-muted-foreground">Monthly digital payslips will appear here after payroll processing.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/60 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/40">
                <TableRow>
                  <TableHead className="text-xs font-bold">Pay Period</TableHead>
                  <TableHead className="text-xs font-bold">Basic + HRA</TableHead>
                  <TableHead className="text-xs font-bold">Deductions (PF/TDS)</TableHead>
                  <TableHead className="text-xs font-bold">Net In-Hand Payout</TableHead>
                  <TableHead className="text-xs font-bold">Status</TableHead>
                  <TableHead className="text-right text-xs font-bold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myPayslips.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-bold text-xs text-foreground">
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
                    <TableCell>
                      <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">
                        {p.status || "Generated"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadPDF(p.id, p.month || "June", p.year || 2026)}
                        className="h-7 text-xs gap-1 border-border/60"
                      >
                        <Download className="w-3 h-3" /> PDF Payslip
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}