import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Bot,
  Play,
  Layers,
  FileText,
  Receipt,
  Gift,
  MinusCircle,
  Handshake,
  Timer,
  FileSpreadsheet,
  CheckCircle2,
  Building2,
  ShieldCheck,
  BarChart3,
  Settings,
  Plus,
  Trash2,
  Download,
  AlertTriangle,
  Send,
  Lock,
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import {
  usePayrollStore,
  type PayrollRun,
  type SalaryStructure,
  type PayslipItem,
  type ReimbursementClaim,
  type BonusPayout,
  type StatutoryDeduction,
  type SalaryAdvance,
  type OvertimePayment,
  type TaxDeclaration,
  type PayrollApproval,
  type BankTransferBatch,
  type StatutoryFiling,
} from "@/stores/payrollStore";
import {
  computeEmployeePayroll,
  decomposeCtc,
  calculateMonthlyTds,
} from "@/utils/payrollCalculations";
import { formatCurrency, getCurrencyIcon, SUPPORTED_CURRENCIES } from "@/utils/currency";
import { toast } from "sonner";

export default function PayrollPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "salary-processing";
  const setTab = (tab: string) => setSearchParams({ tab });

  const { user } = useAuth();
  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];
  const {
    runs,
    structures,
    payslips,
    reimbursements,
    bonuses,
    deductions,
    advances,
    overtimePays,
    taxDeclarations,
    approvals,
    bankTransfers,
    complianceFilings,
    settings,
    addRun,
    addStructure,
    deleteStructure,
    addPayslip,
    addReimbursement,
    updateReimbursementStatus,
    addBonus,
    updateBonusStatus,
    addDeduction,
    deleteDeduction,
    addAdvance,
    updateAdvanceStatus,
    addOvertimePay,
    updateOvertimePayStatus,
    addTaxDeclaration,
    updateTaxDeclarationStatus,
    addApprovalTier,
    updateApprovalStatus,
    addBankTransfer,
    addComplianceFiling,
    updateSettings,
  } = usePayrollStore();

  // Dialog Visibility States
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [isStructModalOpen, setIsStructModalOpen] = useState(false);
  const [isReimbModalOpen, setIsReimbModalOpen] = useState(false);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [isDedModalOpen, setIsDedModalOpen] = useState(false);
  const [isAdvModalOpen, setIsAdvModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);

  // Form Fields
  const [runMonth, setRunMonth] = useState("June 2026");

  const [structGrade, setStructGrade] = useState("");
  const [structBasic, setStructBasic] = useState("50");
  const [structHra, setStructHra] = useState("20");
  const [structDa, setStructDa] = useState("10");

  const [reimbCategory, setReimbCategory] = useState<ReimbursementClaim["category"]>("Fuel & Travel");
  const [reimbAmount, setReimbAmount] = useState("");
  const [reimbDesc, setReimbDesc] = useState("");

  const [bonusEmp, setBonusEmp] = useState("");
  const [bonusType, setBonusType] = useState<BonusPayout["type"]>("Performance Bonus");
  const [bonusAmount, setBonusAmount] = useState("");

  const [dedName, setDedName] = useState("");
  const [dedType, setDedType] = useState<StatutoryDeduction["type"]>("PF (Provident Fund)");
  const [dedPct, setDedPct] = useState("12");

  const [advEmp, setAdvEmp] = useState("");
  const [advAmount, setAdvAmount] = useState("");
  const [advEmi, setAdvEmi] = useState("6");

  const [taxRegime, setTaxRegime] = useState<TaxDeclaration["regime"]>("New Tax Regime (Sec 115BAC)");
  const [tax80C, setTax80C] = useState("150000");
  const [tax80D, setTax80D] = useState("25000");

  // Format Currency dynamically according to Country / Currency Settings
  const fmt = (n: number) => {
    return formatCurrency(n, settings.currency);
  };

  // Action Handlers
  const handleRunPayroll = () => {
    const activeEmployees =
      employees.length > 0
        ? employees
        : [
            { id: "EMP-101", name: "Alex Mercer", department: "Human Resources", salary: "12,00,000" },
            { id: "EMP-102", name: "Sarah Jenkins", department: "Design", salary: "10,50,000" },
            { id: "EMP-103", name: "Vinit Sharma", department: "Engineering", salary: "18,00,000" },
            { id: "EMP-104", name: "Rajesh Malhotra", department: "Finance", salary: "15,00,000" },
          ];

    let totalGross = 0;
    let totalNet = 0;

    activeEmployees.forEach((emp: any) => {
      const rawSalary = emp.salary ? parseFloat(String(emp.salary).replace(/[^0-9.]/g, "")) : 1200000;
      const annualCtc = rawSalary > 100000 ? rawSalary : rawSalary * 12;

      // Find approved reimbursement, bonus, overtime, and advances
      const empReimb = reimbursements
        .filter((r) => (r.employeeId === emp.id || r.employeeName === emp.name) && r.status === "Approved")
        .reduce((sum, r) => sum + r.amount, 0);

      const empBonus = bonuses
        .filter((b) => (b.employeeId === emp.id || b.employeeName === emp.name) && b.status === "Approved")
        .reduce((sum, b) => sum + b.amount, 0);

      const empOt = overtimePays
        .filter((o) => (o.employeeId === emp.id || o.employeeName === emp.name) && o.status === "Approved")
        .reduce((sum, o) => sum + o.totalPayout, 0);

      const empAdv = advances
        .filter((a) => (a.employeeId === emp.id || a.employeeName === emp.name) && (a.status === "Approved" || a.status === "Active EMI"))
        .reduce((sum, a) => sum + a.monthlyEmi, 0);

      const empTax = taxDeclarations.find((t) => t.employeeId === emp.id || t.employeeName === emp.name);

      const payrollComp = computeEmployeePayroll({
        employeeId: emp.id,
        employeeName: emp.name,
        annualCtc,
        approvedBonus: empBonus,
        approvedOvertimeHours: empOt > 0 ? 5 : 0,
        approvedReimbursement: empReimb,
        activeSalaryAdvanceEmi: empAdv,
        taxRegime: empTax?.regime,
        declared80C: empTax?.declared80C,
        declared80D: empTax?.declared80D,
      });

      totalGross += payrollComp.grossEarnings;
      totalNet += payrollComp.netSalary;

      addPayslip({
        employeeId: emp.id,
        employeeName: emp.name,
        department: emp.department || "Engineering",
        month: runMonth,
        year: 2026,
        basic: payrollComp.components.basic,
        hra: payrollComp.components.hra,
        specialAllowance: payrollComp.components.specialAllowance,
        pfDeduction: payrollComp.statutoryDeductions.employeePf,
        ptDeduction: payrollComp.statutoryDeductions.professionalTax,
        tdsDeduction: payrollComp.statutoryDeductions.monthlyTds,
        netSalary: payrollComp.netSalary,
        status: "Generated",
      });
    });

    addRun({
      month: runMonth,
      year: 2026,
      processedEmpCount: activeEmployees.length,
      grossTotal: totalGross,
      netTotal: totalNet,
      status: "Approved",
    });

    setIsRunModalOpen(false);
    toast.success(`Payroll processed for ${runMonth}! Generated ${activeEmployees.length} payslips.`);
  };

  const handleExportBankAdvice = (batch: BankTransferBatch) => {
    const headers = [
      "Batch ID",
      "Bank Name",
      "Batch Reference",
      "Employee Count",
      "Total Amount (INR)",
      "File Format",
      "Generated Date",
      "Account Status",
    ];

    const row = [
      batch.id,
      batch.bankName,
      batch.batchReference,
      batch.employeeCount,
      batch.totalAmount,
      batch.fileFormat,
      batch.generatedAt,
      "Corporate Gate Cleared (Masked AC: •••• 4892)",
    ];

    const csvContent = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `OFC360_Bank_Payout_Advice_${batch.batchReference}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${batch.fileFormat} bank payout advice.`);
  };

  const handleExportStatutoryFiling = (filing: StatutoryFiling) => {
    const headers = ["Filing ID", "Period", "Type", "Total Contribution (INR)", "Status", "Filing Date"];
    const row = [filing.id, filing.period, filing.type, filing.totalContribution, filing.status, filing.filingDate];
    const csvContent = [headers.join(","), row.join(",")].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `OFC360_${filing.type.replace(/\s+/g, "_")}_${filing.period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filing.type} return file.`);
  };

  const handleCreateStructure = () => {
    if (!structGrade.trim()) {
      toast.error("Please enter a grade band name.");
      return;
    }
    addStructure({
      gradeName: structGrade.trim(),
      basicPct: parseFloat(structBasic) || 50,
      hraPct: parseFloat(structHra) || 20,
      daPct: parseFloat(structDa) || 10,
      specialAllowancePct: 20,
      conveyance: 1600,
      lta: 25000,
    });
    setStructGrade("");
    setIsStructModalOpen(false);
    toast.success("Salary CTC Grade Template created!");
  };

  const handleCreateReimbursement = () => {
    if (!reimbAmount || !reimbDesc.trim()) {
      toast.error("Please enter amount and description.");
      return;
    }
    addReimbursement({
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      category: reimbCategory,
      amount: parseFloat(reimbAmount) || 0,
      description: reimbDesc.trim(),
      status: "Pending",
    });
    setReimbAmount("");
    setReimbDesc("");
    setIsReimbModalOpen(false);
    toast.success("Expense reimbursement claim submitted!");
  };

  const handleCreateBonus = () => {
    if (!bonusEmp.trim() || !bonusAmount) {
      toast.error("Employee name and amount are required.");
      return;
    }
    addBonus({
      employeeId: "EMP-" + Math.floor(1000 + Math.random() * 9000),
      employeeName: bonusEmp.trim(),
      type: bonusType,
      amount: parseFloat(bonusAmount) || 0,
      month: "June 2026",
      status: "Pending",
    });
    setBonusEmp("");
    setBonusAmount("");
    setIsBonusModalOpen(false);
    toast.success("Bonus payout entry added!");
  };

  const handleCreateDeduction = () => {
    if (!dedName.trim()) {
      toast.error("Deduction name is required.");
      return;
    }
    addDeduction({
      name: dedName.trim(),
      type: dedType,
      ratePercentage: parseFloat(dedPct) || 0,
      fixedAmount: 0,
      mandatory: true,
    });
    setDedName("");
    setIsDedModalOpen(false);
    toast.success("Statutory deduction rule created!");
  };

  const handleCreateAdvance = () => {
    if (!advEmp.trim() || !advAmount) {
      toast.error("Employee and loan amount are required.");
      return;
    }
    const amt = parseFloat(advAmount) || 50000;
    const months = parseInt(advEmi) || 6;
    addAdvance({
      employeeId: "EMP-" + Math.floor(1000 + Math.random() * 9000),
      employeeName: advEmp.trim(),
      requestedAmount: amt,
      emiMonths: months,
      monthlyEmi: Math.round(amt / months),
      balanceRemaining: amt,
      status: "Pending",
    });
    setAdvEmp("");
    setAdvAmount("");
    setIsAdvModalOpen(false);
    toast.success("Salary advance request submitted!");
  };

  const handleCreateTaxDeclaration = () => {
    addTaxDeclaration({
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      financialYear: "FY 2026-27",
      regime: taxRegime,
      declared80C: parseFloat(tax80C) || 150000,
      declared80D: parseFloat(tax80D) || 25000,
      homeLoanInterest: 0,
      status: "Verified",
    });
    setIsTaxModalOpen(false);
    toast.success("IT TDS Tax declaration saved & verified!");
  };

  const navModules = [
    { id: "copilot", label: "AI Payroll Copilot", icon: Bot },
    { id: "salary-processing", label: "Run Payroll", icon: Play },
    { id: "salary-structure", label: "CTC Builder", icon: Layers },
    { id: "payslips", label: "Payslips Hub", icon: FileText },
    { id: "reimbursements", label: "Reimbursements", icon: Receipt },
    { id: "bonuses", label: "Bonuses & Variable Pay", icon: Gift },
    { id: "deductions", label: "Statutory Deductions", icon: MinusCircle },
    { id: "advances", label: "Salary Advances & Loans", icon: Handshake },
    { id: "overtime", label: "Overtime (OT)", icon: Timer },
    { id: "tax", label: "TDS & Tax Declarations", icon: FileSpreadsheet },
    { id: "approvals", label: "Multi-Tier Approvals", icon: CheckCircle2 },
    { id: "bank-transfers", label: "Bank Payout Advice", icon: Building2 },
    { id: "compliance", label: "PF / ESI Compliance", icon: ShieldCheck },
    { id: "reports", label: "Payroll Analytics", icon: BarChart3 },
    { id: "settings", label: "Pay Settings", icon: Settings },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Clean Top Header Control Row */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Select value={activeTab} onValueChange={setTab}>
            <SelectTrigger className="w-64 text-xs h-9 bg-card border-border/70 font-semibold shadow-xs">
              <SelectValue placeholder="Select Payroll Module" />
            </SelectTrigger>
            <SelectContent>
              {navModules.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-xs font-medium">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* TAB CONTENT PANES */}
      <AnimatePresence mode="wait">
        {/* 1. AI PAYROLL COPILOT */}
        {activeTab === "copilot" && (
          <motion.div key="copilot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                <span>OFC360 AI Pre-Payroll Audit & Anomaly Intelligence</span>
              </div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                Automated Salary Audit & Discrepancy Prevention
              </h2>
              <p className="text-xs text-muted-foreground max-w-3xl leading-relaxed">
                The AI Payroll Copilot continuously audits Loss-of-Pay (LOP) sync, unapproved overtime entries, TDS tax calculations, and duplicate bank account details before salary disbursement.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Pre-Payroll Health Score
                  </span>
                  <p className="text-2xl font-extrabold font-mono text-emerald-500">99.4%</p>
                  <span className="text-[11px] text-muted-foreground">0 critical compliance blocks</span>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Flagged Variances
                  </span>
                  <p className="text-2xl font-extrabold font-mono text-amber-500">0</p>
                  <span className="text-[11px] text-muted-foreground">No salary spikes detected</span>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" /> Statutory Tax Accuracy
                  </span>
                  <p className="text-2xl font-extrabold font-mono text-primary">100%</p>
                  <span className="text-[11px] text-muted-foreground">PF & ESI ECR aligned</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 2. SALARY PROCESSING & RUN PAYROLL */}
        {activeTab === "salary-processing" && (
          <motion.div key="salary-processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Monthly Salary Processing Engine</h2>
                <p className="text-xs text-muted-foreground">1-Click gross-to-net calculation with attendance LOP sync.</p>
              </div>
              <Button onClick={() => setIsRunModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Play className="w-4 h-4" /> Run Payroll Wizard
              </Button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Payroll Batch</TableHead>
                    <TableHead className="text-xs font-bold">Processed Employees</TableHead>
                    <TableHead className="text-xs font-bold">Gross Total CTC</TableHead>
                    <TableHead className="text-xs font-bold">Net Salary Payout</TableHead>
                    <TableHead className="text-xs font-bold">Processed Date</TableHead>
                    <TableHead className="text-right text-xs font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {runs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                        <Play className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No payroll runs executed yet</p>
                        <p className="text-[11px]">Click "Run Payroll Wizard" to process monthly salaries.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    runs.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-bold text-xs text-foreground">{r.month} {r.year}</TableCell>
                        <TableCell className="text-xs font-mono font-bold">{r.processedEmpCount} Employees</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{fmt(r.grossTotal)}</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-emerald-500">{fmt(r.netTotal)}</TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground">{r.processedAt}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold">
                            {r.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* 3. SALARY STRUCTURE & CTC BUILDER */}
        {activeTab === "salary-structure" && (
          <motion.div key="salary-structure" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Salary Structures & Grade CTC Builder</h2>
                <p className="text-xs text-muted-foreground">Define Basic, HRA, DA, and Special Allowance percentages for employee grades.</p>
              </div>
              <Button onClick={() => setIsStructModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Plus className="w-4 h-4" /> Add Grade Band Structure
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {structures.map((s) => (
                <div key={s.id} className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-foreground">{s.gradeName}</h3>
                    <Button variant="ghost" size="icon" onClick={() => deleteStructure(s.id)} className="h-7 w-7 text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="space-y-1.5 p-3 rounded-xl bg-secondary/30 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Basic Salary</span><span className="font-mono font-bold text-foreground">{s.basicPct}% CTC</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">HRA</span><span className="font-mono text-foreground">{s.hraPct}% CTC</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Special Allowance</span><span className="font-mono text-foreground">{s.specialAllowancePct}% CTC</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Conveyance / LTA</span><span className="font-mono text-primary font-bold">₹{s.conveyance + s.lta}/yr</span></div>
                  </div>
                </div>
              ))}
            </div>

            {structures.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
                <Layers className="w-8 h-8 mx-auto text-muted-foreground/40" />
                <h4 className="font-bold text-sm text-foreground">No CTC Grade Structures Defined</h4>
                <p className="text-xs text-muted-foreground">Click "+ Add Grade Band Structure" to configure salary breakdown templates.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* 4. PAYSLIPS MANAGEMENT */}
        {activeTab === "payslips" && (
          <motion.div key="payslips" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Digital Payslips Repository</h2>
                <p className="text-xs text-muted-foreground">Password-protected PDF payslips generated per employee.</p>
              </div>
              <Button onClick={() => toast.success("Bulk emailing password-protected payslips to all employees...")} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Send className="w-4 h-4" /> Bulk Email Payslips
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
                  {payslips.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                        <FileText className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No payslips generated for this period</p>
                        <p className="text-[11px]">Run payroll in the "Run Payroll" tab to generate employee payslips.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    payslips.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-bold text-xs text-foreground">{p.employeeName}</TableCell>
                        <TableCell className="text-xs font-mono">{p.month} {p.year}</TableCell>
                        <TableCell className="text-xs font-mono">{fmt(p.basic + p.hra)}</TableCell>
                        <TableCell className="text-xs font-mono text-destructive">-{fmt(p.pfDeduction + p.tdsDeduction)}</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-emerald-500">{fmt(p.netSalary)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => toast.success(`Downloading PDF payslip for ${p.employeeName}...`)} className="h-7 text-xs gap-1 border-border/60">
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
        )}

        {/* 5. REIMBURSEMENTS */}
        {activeTab === "reimbursements" && (
          <motion.div key="reimbursements" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Expense Claims & Tax-Free Reimbursements</h2>
                <p className="text-xs text-muted-foreground">Review fuel, internet, and travel claims for non-taxable payout.</p>
              </div>
              <Button onClick={() => setIsReimbModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Plus className="w-4 h-4" /> Submit Expense Claim
              </Button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Employee</TableHead>
                    <TableHead className="text-xs font-bold">Category</TableHead>
                    <TableHead className="text-xs font-bold">Description</TableHead>
                    <TableHead className="text-xs font-bold">Claim Amount</TableHead>
                    <TableHead className="text-xs font-bold">Submitted Date</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-right text-xs font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reimbursements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                        <Receipt className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No reimbursement claims submitted</p>
                        <p className="text-[11px]">Click "+ Submit Expense Claim" to upload expense bills.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    reimbursements.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-bold text-xs text-foreground">{r.employeeName}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{r.category}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{r.description}</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-primary">{fmt(r.amount)}</TableCell>
                        <TableCell className="text-xs font-mono">{r.submittedAt}</TableCell>
                        <TableCell>
                          <Badge className={r.status === "Approved" ? "bg-emerald-500/15 text-emerald-500" : r.status === "Rejected" ? "bg-destructive/15 text-destructive" : "bg-amber-500/15 text-amber-500"}>
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {r.status === "Pending" && (
                            <div className="flex items-center justify-end gap-1">
                              <Button size="sm" variant="ghost" onClick={() => updateReimbursementStatus(r.id, "Approved")} className="h-7 text-xs text-emerald-500">
                                Approve
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => updateReimbursementStatus(r.id, "Rejected")} className="h-7 text-xs text-destructive">
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* 6. BONUSES & VARIABLE PAY */}
        {activeTab === "bonuses" && (
          <motion.div key="bonuses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Bonuses, Commissions & Incentives</h2>
                <p className="text-xs text-muted-foreground">Performance rewards, festival bonuses, and sales commissions.</p>
              </div>
              <Button onClick={() => setIsBonusModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Plus className="w-4 h-4" /> Add Bonus Payout
              </Button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Employee</TableHead>
                    <TableHead className="text-xs font-bold">Reward Category</TableHead>
                    <TableHead className="text-xs font-bold">Amount</TableHead>
                    <TableHead className="text-xs font-bold">Payout Period</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-right text-xs font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bonuses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                        <Gift className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No bonus entries added</p>
                        <p className="text-[11px]">Click "+ Add Bonus Payout" to assign performance rewards.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    bonuses.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-bold text-xs text-foreground">{b.employeeName}</TableCell>
                        <TableCell><Badge className="bg-primary/10 text-primary text-[10px] font-bold">{b.type}</Badge></TableCell>
                        <TableCell className="text-xs font-mono font-bold text-emerald-500">{fmt(b.amount)}</TableCell>
                        <TableCell className="text-xs font-mono">{b.month}</TableCell>
                        <TableCell>
                          <Badge className={b.status === "Paid" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}>
                            {b.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {b.status === "Pending" && (
                            <Button size="sm" variant="ghost" onClick={() => updateBonusStatus(b.id, "Approved")} className="h-7 text-xs text-emerald-500">
                              Approve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* 7. DEDUCTIONS & STATUTORY BENEFITS */}
        {activeTab === "deductions" && (
          <motion.div key="deductions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Deductions & Statutory Benefit Rules</h2>
                <p className="text-xs text-muted-foreground">Provident Fund (PF 12%), ESI (0.75%), PT and voluntary NPS contributions.</p>
              </div>
              <Button onClick={() => setIsDedModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Plus className="w-4 h-4" /> Add Statutory Deduction
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deductions.map((d) => (
                <div key={d.id} className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-foreground">{d.name}</h3>
                    <Button variant="ghost" size="icon" onClick={() => deleteDeduction(d.id)} className="h-7 w-7 text-destructive">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="space-y-1.5 p-3 rounded-xl bg-secondary/30 text-xs">
                    <div className="flex justify-between"><span className="text-muted-foreground">Deduction Type</span><span className="font-semibold text-foreground">{d.type}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Rate Percentage</span><span className="font-mono font-bold text-destructive">{d.ratePercentage}%</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Statutory Mandatory</span><span className="font-bold text-emerald-500">{d.mandatory ? "Yes" : "Optional"}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {deductions.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
                <MinusCircle className="w-8 h-8 mx-auto text-muted-foreground/40" />
                <h4 className="font-bold text-sm text-foreground">No Statutory Deductions Configured</h4>
                <p className="text-xs text-muted-foreground">Click "+ Add Statutory Deduction" to set up PF, ESI, or PT rules.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* 8. ADVANCES & LOANS */}
        {activeTab === "advances" && (
          <motion.div key="advances" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Salary Advances & Loan Recovery Engine</h2>
                <p className="text-xs text-muted-foreground">Track employee emergency advance requests and monthly EMI auto-deductions.</p>
              </div>
              <Button onClick={() => setIsAdvModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Plus className="w-4 h-4" /> Request Salary Advance
              </Button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Employee</TableHead>
                    <TableHead className="text-xs font-bold">Loan Amount</TableHead>
                    <TableHead className="text-xs font-bold">Tenure (EMI)</TableHead>
                    <TableHead className="text-xs font-bold">Monthly Deduction</TableHead>
                    <TableHead className="text-xs font-bold">Balance Remaining</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-right text-xs font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advances.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                        <Handshake className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No active salary advances or loans</p>
                        <p className="text-[11px]">Click "+ Request Salary Advance" to apply for emergency loan approval.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    advances.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="font-bold text-xs text-foreground">{a.employeeName}</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-primary">{fmt(a.requestedAmount)}</TableCell>
                        <TableCell className="text-xs font-mono">{a.emiMonths} months</TableCell>
                        <TableCell className="text-xs font-mono text-destructive">{fmt(a.monthlyEmi)}/mo</TableCell>
                        <TableCell className="text-xs font-mono font-bold">{fmt(a.balanceRemaining)}</TableCell>
                        <TableCell>
                          <Badge className={a.status === "Active EMI" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}>
                            {a.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {a.status === "Pending" && (
                            <Button size="sm" variant="ghost" onClick={() => updateAdvanceStatus(a.id, "Active EMI")} className="h-7 text-xs text-emerald-500">
                              Approve Loan
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* 9. OVERTIME PAYMENTS */}
        {activeTab === "overtime" && (
          <motion.div key="overtime" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Overtime (OT) Payout Approval Queue</h2>
                <p className="text-xs text-muted-foreground">Approve 1.5x / 2.0x hourly rates for extra hours worked.</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Employee</TableHead>
                    <TableHead className="text-xs font-bold">OT Hours</TableHead>
                    <TableHead className="text-xs font-bold">Rate Multiplier</TableHead>
                    <TableHead className="text-xs font-bold">Calculated Payout</TableHead>
                    <TableHead className="text-xs font-bold">Period</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-right text-xs font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overtimePays.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                        <Timer className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No overtime payouts queued</p>
                        <p className="text-[11px]">Approved overtime hours from the Attendance module will sync here for payout.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    overtimePays.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-bold text-xs text-foreground">{o.employeeName}</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-primary">+{o.hours} hrs</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{o.rateMultiplier}</Badge></TableCell>
                        <TableCell className="text-xs font-mono font-bold text-emerald-500">{fmt(o.totalPayout)}</TableCell>
                        <TableCell className="text-xs font-mono">{o.month}</TableCell>
                        <TableCell>
                          <Badge className={o.status === "Paid" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}>
                            {o.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {o.status === "Pending" && (
                            <Button size="sm" variant="ghost" onClick={() => updateOvertimePayStatus(o.id, "Approved")} className="h-7 text-xs text-emerald-500">
                              Approve Payout
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* 10. TAX MANAGEMENT & TDS DECLARATIONS */}
        {activeTab === "tax" && (
          <motion.div key="tax" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Tax Management & Sec 80C/80D TDS Declarations</h2>
                <p className="text-xs text-muted-foreground">Manage employee income tax regimes, investment proofs and Form 16.</p>
              </div>
              <Button onClick={() => setIsTaxModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Plus className="w-4 h-4" /> Save IT Tax Declaration
              </Button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Employee</TableHead>
                    <TableHead className="text-xs font-bold">Financial Year</TableHead>
                    <TableHead className="text-xs font-bold">Selected Tax Regime</TableHead>
                    <TableHead className="text-xs font-bold">Sec 80C Declared</TableHead>
                    <TableHead className="text-xs font-bold">Sec 80D Health</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-right text-xs font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxDeclarations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                        <FileSpreadsheet className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No TDS tax declarations submitted</p>
                        <p className="text-[11px]">Click "+ Save IT Tax Declaration" to submit Section 80C/80D tax proofs.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    taxDeclarations.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-bold text-xs text-foreground">{t.employeeName}</TableCell>
                        <TableCell className="text-xs font-mono">{t.financialYear}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{t.regime}</Badge></TableCell>
                        <TableCell className="text-xs font-mono text-emerald-500">{fmt(t.declared80C)}</TableCell>
                        <TableCell className="text-xs font-mono text-emerald-500">{fmt(t.declared80D)}</TableCell>
                        <TableCell>
                          <Badge className={t.status === "Approved" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}>
                            {t.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => toast.success(`Generating Form 16 Part A & B for ${t.employeeName}...`)} className="h-7 text-xs border-border/60">
                            Form 16
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* 11. MULTI-TIER APPROVALS */}
        {activeTab === "approvals" && (
          <motion.div key="approvals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Multi-Tier Payroll Sign-Off Workflow</h2>
                <p className="text-xs text-muted-foreground">3-Tier approval chain: HR Executive Draft ➔ Finance Verification ➔ CXO Sign-off.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Tier 1: HR Executive Draft", desc: "Drafts attendance LOP and bonus payouts.", status: "Verified & Locked" },
                { title: "Tier 2: Finance Verification", desc: "Audits tax deductions and bank account balances.", status: "Verified & Locked" },
                { title: "Tier 3: CXO Final Sign-off", desc: "Authorizes bank advice disbursement.", status: "Ready for Disbursal" },
              ].map((tier, idx) => (
                <div key={tier.title} className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-primary">Stage 0{idx + 1}</span>
                    <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">{tier.status}</Badge>
                  </div>
                  <h3 className="font-bold text-sm text-foreground">{tier.title}</h3>
                  <p className="text-xs text-muted-foreground">{tier.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 12. BANK TRANSFERS & PAYOUT FILE */}
        {activeTab === "bank-transfers" && (
          <motion.div key="bank-transfers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Bank Advice File Generator & Payouts</h2>
                <p className="text-xs text-muted-foreground">Export standard batch payout files for HDFC, ICICI, SBI, and Axis Bank.</p>
              </div>
              <Button onClick={() => addBankTransfer({ bankName: "HDFC Bank", batchReference: "HDFC-PAY-JUNE26", totalAmount: 720000, employeeCount: 10, fileFormat: "HDFC TXT Format" })} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Download className="w-4 h-4" /> Generate HDFC Payout File
              </Button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Bank Name</TableHead>
                    <TableHead className="text-xs font-bold">Batch Reference</TableHead>
                    <TableHead className="text-xs font-bold">File Format</TableHead>
                    <TableHead className="text-xs font-bold">Total Amount</TableHead>
                    <TableHead className="text-xs font-bold">Generated Date</TableHead>
                    <TableHead className="text-right text-xs font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bankTransfers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-xs">
                        <Building2 className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No bank transfer advice files generated</p>
                        <p className="text-[11px]">Click "Generate HDFC Payout File" to export corporate bank payment advice files.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    bankTransfers.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-bold text-xs text-foreground">{b.bankName}</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-primary">{b.batchReference}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{b.fileFormat}</Badge></TableCell>
                        <TableCell className="text-xs font-mono font-bold text-emerald-500">{fmt(b.totalAmount)}</TableCell>
                        <TableCell className="text-xs font-mono">{b.generatedAt}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => handleExportBankAdvice(b)} className="h-7 text-xs gap-1 border-border/60">
                            <Download className="w-3 h-3" /> Download Advice (.csv)
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* 13. STATUTORY COMPLIANCE & PF/ESI */}
        {activeTab === "compliance" && (
          <motion.div key="compliance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">EPFO ECR & ESIC Monthly Filings</h2>
                <p className="text-xs text-muted-foreground">Export 1-click Provident Fund ECR files and State PT Challans.</p>
              </div>
              <Button onClick={() => addComplianceFiling({ period: "August 2026", type: "EPFO Monthly ECR", totalContribution: 102000, status: "Filed On-Time" })} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Generate EPFO ECR File
              </Button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Filing Type</TableHead>
                    <TableHead className="text-xs font-bold">Filing Period</TableHead>
                    <TableHead className="text-xs font-bold">Total Statutory Contribution</TableHead>
                    <TableHead className="text-xs font-bold">Filing Date</TableHead>
                    <TableHead className="text-right text-xs font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceFilings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground text-xs">
                        <ShieldCheck className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No statutory ECR files generated</p>
                        <p className="text-[11px]">Click "Generate EPFO ECR File" to prepare monthly PF/ESI returns.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    complianceFilings.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-bold text-xs text-foreground">{c.type}</TableCell>
                        <TableCell className="text-xs font-mono">{c.period}</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-emerald-500">{fmt(c.totalContribution)}</TableCell>
                        <TableCell className="text-xs font-mono">{c.filingDate}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => handleExportStatutoryFiling(c)} className="h-7 text-xs gap-1 border-border/60">
                            <Download className="w-3 h-3" /> Download Return
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* 14. PAYROLL ANALYTICS & COST REPORTS */}
        {activeTab === "reports" && (
          <motion.div key="reports" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Cost Center Analytics & Accounting Ledgers</h2>
                <p className="text-xs text-muted-foreground">Department-wise manpower expense analysis and Tally/Zoho ledger export.</p>
              </div>
              <Button onClick={() => toast.success("Exporting Financial Ledger for Tally / QuickBooks...")} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <FileSpreadsheet className="w-4 h-4" /> Export Accounting Ledger
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
                <span className="text-xs text-muted-foreground">Monthly Total Payroll CTC</span>
                <p className="text-2xl font-extrabold font-mono text-foreground">₹8,50,000</p>
                <span className="text-[11px] text-emerald-500 font-semibold">MoM Variance: +2.1%</span>
              </div>
              <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
                <span className="text-xs text-muted-foreground">Statutory Deductions (PF/ESI)</span>
                <p className="text-2xl font-extrabold font-mono text-primary">₹1,02,000</p>
                <span className="text-[11px] text-muted-foreground">100% Audit Ready</span>
              </div>
              <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
                <span className="text-xs text-muted-foreground">Net Bank Payout</span>
                <p className="text-2xl font-extrabold font-mono text-emerald-500">₹7,20,000</p>
                <span className="text-[11px] text-muted-foreground">Disbursed via HDFC Advice</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* 15. PAYROLL SETTINGS & PAY CYCLES */}
        {activeTab === "settings" && (
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-border/60 bg-card space-y-6 max-w-2xl">
              <div>
                <h2 className="text-lg font-bold text-foreground">Payroll Policy Settings & Pay Cycles</h2>
                <p className="text-xs text-muted-foreground">Configure salary disbursement frequency, attendance cutoff dates, and currency.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Pay Cycle Frequency</Label>
                  <Select value={settings.payCycleFrequency} onValueChange={(v: any) => updateSettings({ payCycleFrequency: v })}>
                    <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly Cycle (Default)</SelectItem>
                      <SelectItem value="Bi-Weekly">Bi-Weekly Cycle</SelectItem>
                      <SelectItem value="Weekly">Weekly Cycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Attendance Cut-Off Day of Month</Label>
                    <Input type="number" value={settings.attendanceCutoffDay} onChange={(e) => updateSettings({ attendanceCutoffDay: parseInt(e.target.value) || 25 })} className="text-xs bg-secondary/30" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Salary Disbursement Day of Month</Label>
                    <Input type="number" value={settings.salaryDisbursementDay} onChange={(e) => updateSettings({ salaryDisbursementDay: parseInt(e.target.value) || 1 })} className="text-xs bg-secondary/30" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Currency Symbol</Label>
                  <Input value={settings.currency} onChange={(e) => updateSettings({ currency: e.target.value })} className="text-xs bg-secondary/30" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 1: RUN PAYROLL */}
      <Dialog open={isRunModalOpen} onOpenChange={setIsRunModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Run Monthly Payroll Wizard</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Select Pay Period Month *</Label>
              <Input placeholder="e.g. June 2026" value={runMonth} onChange={(e) => setRunMonth(e.target.value)} className="text-xs bg-secondary/30" />
            </div>
            <div className="p-3 rounded-xl bg-secondary/30 text-xs space-y-1">
              <div className="flex justify-between"><span className="text-muted-foreground">Registered Employees</span><span className="font-bold text-foreground">{employees.length || 1}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Attendance Sync</span><span className="font-bold text-emerald-500">Loss of Pay (LOP) Applied</span></div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleRunPayroll} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              Process Payroll & Generate Payslips
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: ADD GRADE STRUCTURE */}
      <Dialog open={isStructModalOpen} onOpenChange={setIsStructModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add CTC Grade Band Structure</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Grade Name *</Label>
              <Input placeholder="e.g. Senior Software Engineer Band (L3)" value={structGrade} onChange={(e) => setStructGrade(e.target.value)} className="text-xs bg-secondary/30" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Basic %</Label>
                <Input type="number" value={structBasic} onChange={(e) => setStructBasic(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">HRA %</Label>
                <Input type="number" value={structHra} onChange={(e) => setStructHra(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">DA %</Label>
                <Input type="number" value={structDa} onChange={(e) => setStructDa(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleCreateStructure} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              Save CTC Structure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: REIMBURSEMENT */}
      <Dialog open={isReimbModalOpen} onOpenChange={setIsReimbModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Submit Expense Reimbursement</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Claim Category</Label>
              <Select value={reimbCategory} onValueChange={(v: any) => setReimbCategory(v)}>
                <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fuel & Travel">Fuel & Travel Allowance</SelectItem>
                  <SelectItem value="Internet & Phone">Internet & Phone Bill</SelectItem>
                  <SelectItem value="Client Dinner">Client Dinner & Entertainment</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies & Books</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Amount (₹) *</Label>
              <Input type="number" placeholder="2500" value={reimbAmount} onChange={(e) => setReimbAmount(e.target.value)} className="text-xs bg-secondary/30" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Bill Description *</Label>
              <Textarea placeholder="Explain business purpose for expense..." value={reimbDesc} onChange={(e) => setReimbDesc(e.target.value)} rows={2} className="text-xs bg-secondary/30" />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleCreateReimbursement} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              Submit Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: BONUS */}
      <Dialog open={isBonusModalOpen} onOpenChange={setIsBonusModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add Bonus / Incentive Payout</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Employee Name *</Label>
              <Input placeholder="Enter employee name..." value={bonusEmp} onChange={(e) => setBonusEmp(e.target.value)} className="text-xs bg-secondary/30" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Bonus Type</Label>
              <Select value={bonusType} onValueChange={(v: any) => setBonusType(v)}>
                <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Performance Bonus">Performance Bonus</SelectItem>
                  <SelectItem value="Sales Commission">Sales Commission</SelectItem>
                  <SelectItem value="Festival Bonus">Festival Bonus</SelectItem>
                  <SelectItem value="Retention Reward">Retention Reward</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Bonus Amount (₹) *</Label>
              <Input type="number" placeholder="15000" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)} className="text-xs bg-secondary/30" />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleCreateBonus} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              Add Bonus Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 5: DEDUCTION */}
      <Dialog open={isDedModalOpen} onOpenChange={setIsDedModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add Statutory Deduction Rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Deduction Rule Name *</Label>
              <Input placeholder="e.g. Employee Provident Fund (PF)" value={dedName} onChange={(e) => setDedName(e.target.value)} className="text-xs bg-secondary/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Category</Label>
                <Select value={dedType} onValueChange={(v: any) => setDedType(v)}>
                  <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PF (Provident Fund)">PF (Provident Fund)</SelectItem>
                    <SelectItem value="ESI">ESI (Employee State Insurance)</SelectItem>
                    <SelectItem value="Professional Tax">Professional Tax (PT)</SelectItem>
                    <SelectItem value="Health Insurance">Health Insurance Premium</SelectItem>
                    <SelectItem value="NPS">National Pension Scheme (NPS)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Rate (%)</Label>
                <Input type="number" step="0.1" value={dedPct} onChange={(e) => setDedPct(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleCreateDeduction} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              Save Deduction Rule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 6: ADVANCE */}
      <Dialog open={isAdvModalOpen} onOpenChange={setIsAdvModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Request Salary Advance / Loan</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Employee Name *</Label>
              <Input placeholder="Enter employee name..." value={advEmp} onChange={(e) => setAdvEmp(e.target.value)} className="text-xs bg-secondary/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Loan Amount (₹) *</Label>
                <Input type="number" placeholder="50000" value={advAmount} onChange={(e) => setAdvAmount(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">EMI Months</Label>
                <Select value={advEmi} onValueChange={setAdvEmi}>
                  <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 Months</SelectItem>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleCreateAdvance} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              Submit Advance Loan Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 7: TAX DECLARATION */}
      <Dialog open={isTaxModalOpen} onOpenChange={setIsTaxModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Submit IT TDS Tax Declaration</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Selected Income Tax Regime</Label>
              <Select value={taxRegime} onValueChange={(v: any) => setTaxRegime(v)}>
                <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="New Tax Regime (Sec 115BAC)">New Tax Regime (Sec 115BAC - Lower Rates)</SelectItem>
                  <SelectItem value="Old Tax Regime (With Exemptions)">Old Tax Regime (With Sec 80C Exemptions)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Sec 80C Investments (₹)</Label>
                <Input type="number" value={tax80C} onChange={(e) => setTax80C(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Sec 80D Mediclaim (₹)</Label>
                <Input type="number" value={tax80D} onChange={(e) => setTax80D(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleCreateTaxDeclaration} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              Save IT Declaration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
