import { useState } from "react";
import { Plus, CheckCircle, Clock, FileText, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useATSStore } from "@/stores/atsStore";
import { RequisitionStatus } from "@/types/ats";
import { toast } from "sonner";

const statusBadges: Record<RequisitionStatus, string> = {
  Draft: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  "Pending HR": "bg-amber-500/10 text-amber-500 border-amber-500/20",
  "Finance Approved": "bg-blue-500/10 text-blue-500 border-blue-500/20",
  "C-Level Approved": "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Closed: "bg-muted text-muted-foreground"
};

export function RequisitionsModule() {
  const { requisitions, addRequisition, updateRequisitionStatus } = useATSStore();
  const [openModal, setOpenModal] = useState(false);

  // New Req State
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [hiringManager, setHiringManager] = useState("Dr. Alex Vance");
  const [targetStartDate, setTargetStartDate] = useState("2026-10-01");
  const [budgetMin, setBudgetMin] = useState(130000);
  const [budgetMax, setBudgetMax] = useState(170000);
  const [justification, setJustification] = useState("");

  const handleCreate = () => {
    if (!title) return toast.error("Please enter a title");
    addRequisition({
      title,
      department,
      hiringManager,
      targetStartDate,
      budgetMin,
      budgetMax,
      currency: "USD",
      justification: justification || "Department Headcount expansion",
      isReplacement: false,
      status: "Pending HR"
    });
    toast.success("Headcount Requisition submitted for HR & Finance approval!");
    setOpenModal(false);
    setTitle("");
    setJustification("");
  };

  const handleApproveStep = (id: string, currentStatus: RequisitionStatus) => {
    let nextStatus: RequisitionStatus = "Draft";
    if (currentStatus === "Pending HR") nextStatus = "Finance Approved";
    else if (currentStatus === "Finance Approved") nextStatus = "C-Level Approved";
    
    updateRequisitionStatus(id, nextStatus);
    toast.success(`Requisition advanced to "${nextStatus}"`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Headcount Requisitions & Approvals</h2>
          <p className="text-sm text-muted-foreground">
            Multi-stage approval workflow: Draft → HR Review → Finance Approval → C-Level Signoff.
          </p>
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 gradient-bg shadow">
              <Plus className="w-4 h-4" /> Request Headcount
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Headcount Requisition Form</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2 text-sm">
              <div>
                <Label>Position Title *</Label>
                <Input
                  placeholder="e.g. Senior Security Architect"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Product Design">Product Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Hiring Manager</Label>
                  <Input value={hiringManager} onChange={(e) => setHiringManager(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Target Start Date</Label>
                  <Input type="date" value={targetStartDate} onChange={(e) => setTargetStartDate(e.target.value)} />
                </div>

                <div>
                  <Label>Budget Min ($)</Label>
                  <Input type="number" value={budgetMin} onChange={(e) => setBudgetMin(Number(e.target.value))} />
                </div>

                <div>
                  <Label>Budget Max ($)</Label>
                  <Input type="number" value={budgetMax} onChange={(e) => setBudgetMax(Number(e.target.value))} />
                </div>
              </div>

              <div>
                <Label>Business Justification & Scope</Label>
                <Textarea
                  placeholder="Explain why this headcount is required..."
                  rows={3}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Submit Requisition</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Requisition Cards */}
      <div className="grid grid-cols-1 gap-4">
        {requisitions.map((req) => (
          <div key={req.id} className="glass-card rounded-xl p-5 border border-border/50 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs font-mono">{req.id}</Badge>
                  <Badge className={`text-xs border ${statusBadges[req.status]}`}>{req.status}</Badge>
                </div>
                <h3 className="font-bold text-lg">{req.title}</h3>
                <p className="text-xs text-muted-foreground">
                  Department: <span className="text-foreground">{req.department}</span> · Hiring Manager:{" "}
                  <span className="text-foreground">{req.hiringManager}</span>
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="bg-secondary/40 p-2.5 rounded-lg border border-border/40">
                  <span className="text-muted-foreground block text-[10px]">ALLOCATED BUDGET</span>
                  <span className="font-bold text-sm text-primary">
                    ${req.budgetMin.toLocaleString()} - ${req.budgetMax.toLocaleString()} {req.currency}
                  </span>
                </div>

                {req.status !== "C-Level Approved" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleApproveStep(req.id, req.status)}
                    className="gap-1 text-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Advance Approval
                  </Button>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground bg-background/50 p-3 rounded-lg border border-border/30">
              <span className="font-semibold text-foreground">Justification: </span> {req.justification}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
