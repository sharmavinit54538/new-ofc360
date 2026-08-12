import { useState } from "react";
import { UserCheck, Laptop, FileCheck, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useATSStore } from "@/stores/atsStore";
import { toast } from "sonner";

export function OnboardingBridge() {
  const { onboardingRecords, candidates, convertToOnboarding } = useATSStore();
  const [openModal, setOpenModal] = useState(false);

  const offerExtendedCandidates = candidates.filter((c) => c.stage === "Offer Extended" || c.stage === "Hired");
  const [candidateId, setCandidateId] = useState(offerExtendedCandidates[0]?.id || candidates[0]?.id || "");
  const [buddy, setBuddy] = useState("Dr. Alex Vance");
  const [startDate, setStartDate] = useState("2026-09-01");

  const handleTransfer = () => {
    if (!candidateId) return toast.error("Select candidate");
    convertToOnboarding(candidateId, buddy, startDate);
    toast.success("Candidate transferred to Employee Onboarding with pre-onboarding checklist!");
    setOpenModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Hired Candidate to Onboarding Handoff Bridge</h2>
          <p className="text-sm text-muted-foreground">
            Convert hired candidates directly into Employee Onboarding records with pre-onboarding doc requests.
          </p>
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 gradient-bg shadow">
              <UserCheck className="w-4 h-4" /> Transfer Hired Candidate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Transfer Hired Candidate to Onboarding</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2 text-sm">
              <div>
                <Label>Candidate</Label>
                <Select value={candidateId} onValueChange={setCandidateId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {candidates.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.jobTitle})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Assigned Onboarding Buddy</Label>
                <Input value={buddy} onChange={(e) => setBuddy(e.target.value)} />
              </div>

              <div>
                <Label>Target Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button onClick={handleTransfer}>Initiate Employee Handoff</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {onboardingRecords.map((onb) => (
          <div key={onb.id} className="glass-card rounded-xl p-5 border border-border/50 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="text-[10px] font-mono mb-1">{onb.id}</Badge>
                <h3 className="font-bold text-base">{onb.candidateName}</h3>
                <p className="text-xs text-muted-foreground">{onb.jobTitle} · {onb.department}</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                {onb.status}
              </Badge>
            </div>

            <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t border-border/30">
              <span>Buddy: {onb.buddyAssigned}</span>
              <span>Start Date: {onb.startDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
