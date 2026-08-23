import { useState, useRef } from "react";
import { FileText, CheckCircle2, PenTool, Send, DollarSign, Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useATSStore } from "@/stores/atsStore";
import { OfferLetter } from "@/types/ats";
import { toast } from "sonner";

export function OfferManagement() {
  const { offers, candidates, createOffer, signOffer } = useATSStore();
  const [openModal, setOpenModal] = useState(false);
  const [selectedOfferToSign, setSelectedOfferToSign] = useState<OfferLetter | null>(null);

  // Form State
  const [candidateId, setCandidateId] = useState(candidates[0]?.id || "");
  const [baseSalary, setBaseSalary] = useState(165000);
  const [bonus, setBonus] = useState(15000);
  const [equity, setEquity] = useState("0.15% Stock Options");
  const [joiningDate, setJoiningDate] = useState("2026-09-01");

  const [signatureText, setSignatureText] = useState("");

  const handleCreateOffer = () => {
    const cand = candidates.find((c) => c.id === candidateId) || candidates[0];
    createOffer({
      candidateId: cand.id,
      candidateName: `${cand.firstName} ${cand.lastName}`,
      jobTitle: cand.jobTitle,
      department: "Engineering",
      baseSalary,
      bonus,
      equity,
      joiningDate,
      status: "Sent to Candidate",
      expiryDate: "2026-08-25"
    });

    toast.success(`Formal offer letter generated & sent to ${cand.firstName}!`);
    setOpenModal(false);
  };

  const handleSignConfirm = () => {
    if (!signatureText.trim() || !selectedOfferToSign) return toast.error("Please enter digital signature text");
    signOffer(selectedOfferToSign.id, `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="50"><text x="10" y="30" font-family="cursive" font-size="20" fill="%236366f1">${encodeURIComponent(signatureText)}</text></svg>`);
    toast.success("Offer letter digitally signed & locked!");
    setSelectedOfferToSign(null);
    setSignatureText("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Offer Letter Management & E-Signatures</h2>
          <p className="text-sm text-muted-foreground">
            Dynamic template variables ({"{{candidate_name}}"}, {"{{base_salary}}"}) & candidate digital signature pad.
          </p>
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 gradient-bg shadow">
              <FileText className="w-4 h-4" /> Create Offer Letter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Official Employment Offer</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2 text-sm">
              <div>
                <Label>Select Candidate</Label>
                <Select value={candidateId} onValueChange={setCandidateId}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {candidates.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.jobTitle})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Base Salary ($/yr)</Label>
                  <Input type="number" value={baseSalary} onChange={(e) => setBaseSalary(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Signing Bonus ($)</Label>
                  <Input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value))} />
                </div>
              </div>

              <div>
                <Label>Equity / Stock Options</Label>
                <Input value={equity} onChange={(e) => setEquity(e.target.value)} />
              </div>

              <div>
                <Label>Expected Joining Date</Label>
                <Input type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button onClick={handleCreateOffer}>Generate & Send Offer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Offer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((off) => (
          <div key={off.id} className="glass-card rounded-xl p-5 border border-border/50 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="text-[10px] font-mono mb-1">{off.id}</Badge>
                <h3 className="font-bold text-lg">{off.candidateName}</h3>
                <p className="text-xs text-muted-foreground">{off.jobTitle} · {off.department}</p>
              </div>
              <Badge className={`text-xs border ${
                off.status === "Signed" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
                {off.status}
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-secondary/30 p-3 rounded-lg text-xs font-mono">
              <div>
                <span className="text-[10px] text-muted-foreground block">BASE SALARY</span>
                <span className="font-bold text-primary">${off.baseSalary.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">SIGNING BONUS</span>
                <span className="font-bold text-emerald-400">${off.bonus.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted-foreground block">START DATE</span>
                <span className="font-bold text-foreground">{off.joiningDate}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-muted-foreground">Expires: {off.expiryDate}</span>
              {off.status !== "Signed" ? (
                <Button size="sm" onClick={() => setSelectedOfferToSign(off)} className="gap-1 text-xs gradient-bg">
                  <PenTool className="w-3.5 h-3.5" /> Sign Offer (Candidate Pad)
                </Button>
              ) : (
                <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30 gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> E-Signed & Locked
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* E-Signature Pad Modal */}
      <Dialog open={Boolean(selectedOfferToSign)} onOpenChange={(open) => !open && setSelectedOfferToSign(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Candidate Digital E-Signature Pad</DialogTitle>
          </DialogHeader>

          {selectedOfferToSign && (
            <div className="space-y-4 py-2 text-sm">
              <div className="bg-secondary/30 p-3 rounded-lg text-xs space-y-1 border border-border/40">
                <p><span className="font-bold">Candidate:</span> {selectedOfferToSign.candidateName}</p>
                <p><span className="font-bold">Role:</span> {selectedOfferToSign.jobTitle}</p>
                <p><span className="font-bold">Total Compensation:</span> ${selectedOfferToSign.baseSalary.toLocaleString()} USD/yr</p>
              </div>

              <div>
                <Label>Type Full Legal Name to Sign Electronically</Label>
                <Input
                  placeholder="e.g. Rahul Mehta"
                  value={signatureText}
                  onChange={(e) => setSignatureText(e.target.value)}
                  className="font-serif italic text-lg"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOfferToSign(null)}>Cancel</Button>
            <Button onClick={handleSignConfirm} className="gradient-bg">Confirm Digital E-Sign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}