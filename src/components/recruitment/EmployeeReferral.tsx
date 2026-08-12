import { useState } from "react";
import { Award, Plus, Copy, Check, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useATSStore } from "@/stores/atsStore";
import { toast } from "sonner";

export function EmployeeReferral() {
  const { referrals, addReferral } = useATSStore();
  const [openModal, setOpenModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [role, setRole] = useState("Senior AI & Fullstack Lead Engineer");

  const referralLink = `${window.location.origin}/careers?ref=EMP_${Math.floor(Math.random() * 899 + 100)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    toast.success("Unique employee referral link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmit = () => {
    if (!candidateName || !candidateEmail) return toast.error("Please fill candidate details");
    addReferral({
      referrerName: "Current Employee",
      referrerEmail: "me@company.com",
      candidateName,
      candidateEmail,
      role,
      bonusAmount: 2500,
      status: "Under Review"
    });

    toast.success(`Referral for ${candidateName} submitted! $2,500 bonus tracking active.`);
    setOpenModal(false);
    setCandidateName("");
    setCandidateEmail("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Employee Referral Portal & Leaderboard</h2>
          <p className="text-sm text-muted-foreground">
            Internal referral link generator, bonus tracking ($2,500 per hire), and referral status pipeline.
          </p>
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 gradient-bg shadow">
              <Plus className="w-4 h-4" /> Submit Referral
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Refer a Colleague or Peer</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2 text-sm">
              <div>
                <Label>Candidate Full Name *</Label>
                <Input placeholder="e.g. Alex Johnson" value={candidateName} onChange={(e) => setCandidateName(e.target.value)} />
              </div>
              <div>
                <Label>Candidate Email *</Label>
                <Input placeholder="alex.j@example.com" value={candidateEmail} onChange={(e) => setCandidateEmail(e.target.value)} />
              </div>
              <div>
                <Label>Target Job Role</Label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Submit Referral</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Referral Link Generator Box */}
      <div className="glass-card p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div>
          <h4 className="font-bold text-sm text-foreground">Your Personal Referral Link</h4>
          <p className="text-muted-foreground">Share this unique URL with your network to auto-attribute referrals.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <input readOnly value={referralLink} className="bg-background border border-border px-3 py-1.5 rounded-md font-mono text-[11px] w-full sm:w-64" />
          <Button size="sm" onClick={handleCopyLink} className="gap-1 text-xs">
            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* Referrals List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {referrals.map((ref) => (
          <div key={ref.id} className="glass-card rounded-xl p-5 border border-border/50 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="text-[10px] font-mono mb-1">{ref.id}</Badge>
                <h3 className="font-bold text-base">{ref.candidateName}</h3>
                <p className="text-xs text-muted-foreground">Referred by: {ref.referrerName}</p>
              </div>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                ${ref.bonusAmount.toLocaleString()} Bonus
              </Badge>
            </div>

            <div className="flex justify-between items-center text-xs pt-2 border-t border-border/30">
              <span className="text-muted-foreground">{ref.role}</span>
              <Badge variant="secondary" className="text-[10px]">{ref.status}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
