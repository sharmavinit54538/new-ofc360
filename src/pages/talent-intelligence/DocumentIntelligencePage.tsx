import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Search,
  Clock,
  ShieldCheck,
  Upload,
  BarChart3,
  Plus,
  Download,
  Send,
  Save,
  CheckCircle2,
  Sparkles,
  Printer,
  Building,
  UserCheck,
  Award,
  AlertTriangle,
  FileCheck,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TalentIntelligenceLayout } from "@/components/talent-intelligence/TalentIntelligenceLayout";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useDocumentStore } from "@/stores/documentStore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function DocumentIntelligencePage() {
  const { employees } = useEmployeeStore();
  const { addDocument } = useDocumentStore();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"studio" | "modules">("studio");

  // Generator Form States
  const [docType, setDocType] = useState<string>("experience");
  const [selectedEmpId, setSelectedEmpId] = useState<string>("");
  const [customName, setCustomName] = useState("Alex Mercer");
  const [customEmpCode, setCustomEmpCode] = useState("EMP-1001");
  const [customDesignation, setCustomDesignation] = useState("Senior Software Engineer");
  const [customDepartment, setCustomDepartment] = useState("Engineering");
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [effectiveDate, setEffectiveDate] = useState("2026-09-01");
  const [signatoryName, setSignatoryName] = useState(user?.name || "Dr. Alex Vance");
  const [signatoryTitle, setSignatoryTitle] = useState("Head of People & HR Operations");
  const [customRemarks, setCustomRemarks] = useState("For bank loan application and address verification purpose.");

  // Sync Form when selecting employee from list
  const handleSelectEmployee = (empId: string) => {
    setSelectedEmpId(empId);
    const emp = employees.find((e) => e.id === empId);
    if (emp) {
      setCustomName(emp.name);
      setCustomEmpCode(emp.id);
      setCustomDesignation(emp.role);
      setCustomDepartment(emp.department);
    }
  };

  // Generate Document Content Dynamically
  const getDocumentDetails = () => {
    switch (docType) {
      case "offer":
        return {
          title: "OFFICIAL APPOINTMENT & OFFER LETTER",
          refNo: `REF/OFC/2026/OFFER-${Math.floor(1000 + Math.random() * 9000)}`,
          body: `Dear ${customName},\n\nWe are pleased to offer you the position of ${customDesignation} in the ${customDepartment} department at OFC360 Enterprise. Your employment will be effective from ${effectiveDate}.\n\nYour annual Total Cost to Company (CTC) will be INR 12,00,000/- (Twelve Lakhs Rupees Only) as per the detailed salary structure attached herewith. You will be on probation for a period of six months.\n\nPlease sign and return the duplicate copy of this letter as token of your acceptance.\n\nSincerely,`,
          category: "Offer Letter",
        };
      case "experience":
        return {
          title: "EXPERIENCE & RELIEVING CERTIFICATE",
          refNo: `REF/OFC/2026/EXP-${Math.floor(1000 + Math.random() * 9000)}`,
          body: `TO WHOMSOEVER IT MAY CONCERN\n\nThis is to certify that ${customName} (Employee ID: ${customEmpCode}) was employed with OFC360 Enterprise as ${customDesignation} in the ${customDepartment} department from 15th January 2023 to ${issueDate}.\n\nDuring their tenure with us, we found them to be sincere, dedicated, and hardworking with outstanding professional conduct. They have been relieved of all their duties effective ${issueDate} after full clearance of company dues.\n\nWe wish them all the success in their future endeavors.`,
          category: "Experience Certificate",
        };
      case "verification":
        return {
          title: "EMPLOYMENT & SALARY VERIFICATION LETTER",
          refNo: `REF/OFC/2026/VER-${Math.floor(1000 + Math.random() * 9000)}`,
          body: `TO WHOMSOEVER IT MAY CONCERN\n\nThis letter confirms that ${customName} is currently employed on a full-time basis with OFC360 Enterprise as ${customDesignation} in the ${customDepartment} department since 1st June 2024.\n\nTheir current annual CTC is INR 14,50,000/-. This letter is issued upon the employee's request for ${customRemarks}.\n\nFor any further authentication, please contact HR Operations.`,
          category: "Verification Letter",
        };
      case "noc":
        return {
          title: "NO OBJECTION CERTIFICATE (NOC)",
          refNo: `REF/OFC/2026/NOC-${Math.floor(1000 + Math.random() * 9000)}`,
          body: `TO WHOMSOEVER IT MAY CONCERN\n\nThis is to certify that OFC360 Enterprise has NO OBJECTION to ${customName} (Employee Code: ${customEmpCode}), currently working as ${customDesignation}, applying for ${customRemarks}.\n\nThe company confirms that the employee will be granted leave as per company policy during this period.`,
          category: "NOC Certificate",
        };
      case "promotion":
        return {
          title: "PROMOTION & SALARY REVISION LETTER",
          refNo: `REF/OFC/2026/PRM-${Math.floor(1000 + Math.random() * 9000)}`,
          body: `Dear ${customName},\n\nIn recognition of your exceptional performance and outstanding contribution to the ${customDepartment} department, the Management is pleased to promote you to the position of ${customDesignation} effective ${effectiveDate}.\n\nAlong with this promotion, your revised annual CTC will be INR 16,80,000/-. All other terms and conditions of your employment contract remain unchanged.\n\nCongratulations on your well-deserved promotion!`,
          category: "Promotion Letter",
        };
      case "internship":
        return {
          title: "INTERNSHIP COMPLETION CERTIFICATE",
          refNo: `REF/OFC/2026/INT-${Math.floor(1000 + Math.random() * 9000)}`,
          body: `TO WHOMSOEVER IT MAY CONCERN\n\nThis is to certify that ${customName} has successfully completed a 6-month Internship Program as ${customDesignation} in the ${customDepartment} department at OFC360 Enterprise from January 2026 to ${issueDate}.\n\nDuring this period, they actively contributed to production software projects and demonstrated commendable problem-solving skills.\n\nGrade Performance: A+ (Outstanding)`,
          category: "Internship Certificate",
        };
      case "warning":
        return {
          title: "PERFORMANCE IMPROVEMENT PLAN (PIP) NOTICE",
          refNo: `REF/OFC/2026/PIP-${Math.floor(1000 + Math.random() * 9000)}`,
          body: `STRICTLY CONFIDENTIAL\n\nTo: ${customName} (${customEmpCode})\nDesignation: ${customDesignation}\n\nThis notice formally initiates a 30-day Performance Improvement Plan (PIP) effective ${effectiveDate} regarding key performance expectations in the ${customDepartment} department.\n\nFailure to achieve target deliverables by the end of this evaluation cycle may result in further administrative action as per HR employment policies.`,
          category: "PIP Notice",
        };
      default:
        return {
          title: "BONAFIDE EMPLOYEE CERTIFICATE",
          refNo: `REF/OFC/2026/BON-${Math.floor(1000 + Math.random() * 9000)}`,
          body: `TO WHOMSOEVER IT MAY CONCERN\n\nThis is to certify that ${customName} is a bonafide full-time employee of OFC360 Enterprise, holding Employee ID ${customEmpCode} and working as ${customDesignation}.\n\nThis certificate is issued for official proof of employment and address verification purposes.`,
          category: "Bonafide Certificate",
        };
    }
  };

  const docData = getDocumentDetails();

  // Download Formatted Document
  const handleDownloadPDF = () => {
    const fullText = `=================================================================\n                 OFC360 ENTERPRISE SOLUTIONS                     \n          100 Cyber City, Technology Tower, Suite 400            \n=================================================================\n\nDate: ${issueDate}\nRef: ${docData.refNo}\n\nSUBJECT: ${docData.title}\n-----------------------------------------------------------------\n\n${docData.body}\n\n-----------------------------------------------------------------\nAuthorized Signatory:\n${signatoryName}\n${signatoryTitle}\nOFC360 HR Operations Seal\n=================================================================`;

    const blob = new Blob([fullText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${docData.category}_${customName.replace(/\s+/g, "_")}.txt`;
    link.click();
    toast.success(`Downloaded ${docData.category} for ${customName}!`);
  };

  // Save Document to Vault
  const handleSaveToVault = () => {
    addDocument({
      name: `${docData.category} - ${customName}`,
      category: docData.category as any,
      size: "245 KB",
      author: signatoryName,
      status: "Verified",
    });
    toast.success(`Saved "${docData.category}" directly to Employee Document Vault!`);
  };

  // Send Email Notification
  const handleSendEmail = () => {
    toast.success(`Emailing signed PDF ${docData.category} to ${customName} (employee@company.com)...`);
  };

  const docTypesList = [
    { id: "experience", label: "Experience & Relieving Certificate", icon: Award },
    { id: "offer", label: "Appointment & Offer Letter", icon: FileCheck },
    { id: "verification", label: "Employment & Salary Verification", icon: ShieldCheck },
    { id: "noc", label: "No Objection Certificate (NOC)", icon: FileText },
    { id: "promotion", label: "Promotion & Salary Increment Letter", icon: Sparkles },
    { id: "internship", label: "Internship Completion Certificate", icon: UserCheck },
    { id: "warning", label: "Warning / PIP Evaluation Notice", icon: AlertTriangle },
    { id: "bonafide", label: "Bonafide Employee Proof", icon: Building },
  ];

  return (
    <TalentIntelligenceLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Mode Navigation Switcher */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-border/40">
          <div className="flex items-center gap-1.5 bg-secondary/50 p-1.5 rounded-2xl border border-border/50">
            <button
              onClick={() => setActiveTab("studio")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "studio"
                  ? "bg-card text-primary font-extrabold shadow-xs border border-border/70"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>AI HR Document Studio & Generator</span>
            </button>
            <button
              onClick={() => setActiveTab("modules")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "modules"
                  ? "bg-card text-primary font-extrabold shadow-xs border border-border/70"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Document Intelligence Modules</span>
            </button>
          </div>
        </div>

        {/* TAB 1: AI HR DOCUMENT STUDIO & GENERATOR */}
        {activeTab === "studio" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Form Controls (5 cols) */}
            <div className="lg:col-span-5 glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4 shadow-sm">
              <div>
                <h2 className="font-extrabold text-base text-foreground flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Generate Employee HR Document</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select a document template and employee to instantly generate official letters with letterhead.
                </p>
              </div>

              {/* Document Type Selector */}
              <div className="space-y-1">
                <Label className="text-xs font-bold">Document Template Type *</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger className="text-xs bg-secondary/30 h-9 font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {docTypesList.map((t) => (
                      <SelectItem key={t.id} value={t.id} className="text-xs font-medium">
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Employee Selection */}
              <div className="space-y-1">
                <Label className="text-xs font-bold">Select Employee (Auto-fill)</Label>
                <Select value={selectedEmpId} onValueChange={handleSelectEmployee}>
                  <SelectTrigger className="text-xs bg-secondary/30 h-9">
                    <SelectValue placeholder="Pick employee from directory..." />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id} className="text-xs">
                        {emp.name} — {emp.role} ({emp.department})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Form Input Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold">Employee Name *</Label>
                  <Input value={customName} onChange={(e) => setCustomName(e.target.value)} className="text-xs bg-secondary/30 h-8" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold">Employee Code *</Label>
                  <Input value={customEmpCode} onChange={(e) => setCustomEmpCode(e.target.value)} className="text-xs bg-secondary/30 h-8 font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold">Designation *</Label>
                  <Input value={customDesignation} onChange={(e) => setCustomDesignation(e.target.value)} className="text-xs bg-secondary/30 h-8" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold">Department *</Label>
                  <Input value={customDepartment} onChange={(e) => setCustomDepartment(e.target.value)} className="text-xs bg-secondary/30 h-8" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold">Issue Date</Label>
                  <Input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="text-xs bg-secondary/30 h-8 font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[11px] font-semibold">Effective Date</Label>
                  <Input type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} className="text-xs bg-secondary/30 h-8 font-mono" />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <Label className="text-[11px] font-semibold">HR Signatory Name & Designation</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input value={signatoryName} onChange={(e) => setSignatoryName(e.target.value)} placeholder="Signatory Name" className="text-xs bg-secondary/30 h-8" />
                  <Input value={signatoryTitle} onChange={(e) => setSignatoryTitle(e.target.value)} placeholder="Title" className="text-xs bg-secondary/30 h-8" />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <Label className="text-[11px] font-semibold">Remarks / Purpose Notes</Label>
                <Textarea value={customRemarks} onChange={(e) => setCustomRemarks(e.target.value)} rows={2} className="text-xs bg-secondary/30" />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Button onClick={handleDownloadPDF} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                  <Download className="w-4 h-4" /> Download PDF Document
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleSaveToVault} className="text-xs h-8 gap-1.5 border-border/70">
                    <Save className="w-3.5 h-3.5 text-primary" /> Save to Vault
                  </Button>
                  <Button variant="outline" onClick={handleSendEmail} className="text-xs h-8 gap-1.5 border-border/70">
                    <Send className="w-3.5 h-3.5 text-emerald-500" /> Email PDF
                  </Button>
                </div>
              </div>
            </div>

            {/* Right Live Document Preview Pane (7 cols) */}
            <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-border/60 bg-card space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-primary" /> Official Letterhead Live Preview
                </span>
                <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold">
                  Verified HR Document
                </Badge>
              </div>

              {/* Official Letterhead Frame */}
              <div className="p-8 rounded-xl border border-border/80 bg-background text-foreground space-y-6 shadow-inner relative overflow-hidden font-sans">
                {/* Company Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-4xl font-extrabold rotate-45 select-none text-foreground">
                  OFC360 ENTERPRISE
                </div>

                {/* Letterhead Header */}
                <div className="flex justify-between items-start border-b-2 border-primary/30 pb-4">
                  <div>
                    <h1 className="text-xl font-black text-primary tracking-tight">OFC360 ENTERPRISE</h1>
                    <p className="text-[10px] text-muted-foreground">100 Cyber City, Technology Tower, Suite 400</p>
                    <p className="text-[10px] text-muted-foreground">Contact: hr@ofc360.com | www.ofc360.com</p>
                  </div>
                  <div className="text-right text-[11px] font-mono text-muted-foreground">
                    <p className="font-bold text-foreground">Date: {issueDate}</p>
                    <p className="text-primary">{docData.refNo}</p>
                  </div>
                </div>

                {/* Document Title */}
                <div className="text-center pt-2">
                  <h2 className="text-sm font-extrabold underline tracking-wide text-foreground decoration-primary/40">
                    {docData.title}
                  </h2>
                </div>

                {/* Document Body */}
                <div className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line space-y-3 font-medium min-h-[220px]">
                  {docData.body}
                </div>

                {/* Letterhead Footer & Signature */}
                <div className="pt-8 border-t border-border/40 flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="w-24 h-10 border-b border-foreground/30 flex items-end justify-center pb-1 italic text-xs font-serif text-primary">
                      {signatoryName.split(" ")[0]}
                    </div>
                    <p className="font-bold text-xs text-foreground">{signatoryName}</p>
                    <p className="text-[10px] text-muted-foreground">{signatoryTitle}</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full border-2 border-emerald-500/40 bg-emerald-500/5 flex items-center justify-center text-[9px] font-mono font-bold text-emerald-500 rotate-12 mx-auto">
                      OFFICIAL<br />HR SEAL
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-1 font-mono">Digitally Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DOCUMENT MODULES */}
        {activeTab === "modules" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {docTypesList.map((doc) => {
                const IconComp = doc.icon;
                return (
                  <div key={doc.id} className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary w-fit">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-foreground">{doc.label}</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDocType(doc.id);
                        setActiveTab("studio");
                      }}
                      className="w-full text-xs h-8 gap-1.5 border-border/60"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-primary" /> Generate Document
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </TalentIntelligenceLayout>
  );
}
