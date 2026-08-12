import { useState } from "react";
import { Building2, AlertTriangle, CheckCircle, Plus, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useATSStore } from "@/stores/atsStore";
import { toast } from "sonner";

export function VendorAgencyPortal() {
  const { vendors, vendorSubmissions, addVendorSubmission } = useATSStore();
  const [openModal, setOpenModal] = useState(false);

  // Submission State
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("Senior AI & Fullstack Lead Engineer");

  const handleSubmitCandidate = () => {
    if (!candidateName || !candidateEmail) return toast.error("Candidate details required");

    addVendorSubmission({
      vendorId: vendors[0]?.id || "VEN-01",
      agencyName: vendors[0]?.agencyName || "Apex Executive Search",
      candidateName,
      candidateEmail,
      jobTitle,
      status: "Pending Review"
    });

    toast.success(`Agency candidate ${candidateName} submitted! Duplicate screening check executed.`);
    setOpenModal(false);
    setCandidateName("");
    setCandidateEmail("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Vendor & Agency Headhunter Portal</h2>
          <p className="text-sm text-muted-foreground">
            External headhunter submission portal with automatic candidate duplication checks.
          </p>
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 gradient-bg shadow">
              <Plus className="w-4 h-4" /> Agency Candidate Submission
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit Candidate via Agency Portal</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2 text-sm">
              <div>
                <Label>Candidate Name *</Label>
                <Input placeholder="e.g. Marcus Vance" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
              </div>
              <div>
                <Label>Candidate Email *</Label>
                <Input placeholder="marcus.v@example.com" value={candidateEmail} onChange={(e) => setCandidateEmail(e.target.value)} />
              </div>
              <div>
                <Label>Position Submitted For</Label>
                <Input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button onClick={handleSubmitCandidate}>Submit & Run Duplicate Check</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Submissions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vendorSubmissions.map((sub) => (
          <div key={sub.id} className="glass-card rounded-xl p-5 border border-border/50 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="text-[10px] font-mono mb-1">{sub.id}</Badge>
                <h3 className="font-bold text-base">{sub.candidateName}</h3>
                <p className="text-xs text-muted-foreground">Agency: {sub.agencyName}</p>
              </div>
              {sub.duplicateFlag ? (
                <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" /> Duplicate Auto-Flagged
                </Badge>
              ) : (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                  Unique Candidate
                </Badge>
              )}
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-border/30">
              <span className="text-muted-foreground">{sub.jobTitle}</span>
              <span className="text-muted-foreground font-mono">{sub.candidateEmail}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
