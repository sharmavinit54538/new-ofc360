import { useState } from "react";
import { Star, ThumbsUp, ThumbsDown, Plus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useATSStore } from "@/stores/atsStore";
import { toast } from "sonner";

export function ScorecardsModule() {
  const { scorecards, candidates, addScorecard } = useATSStore();
  const [openModal, setOpenModal] = useState(false);

  // Form State
  const [candidateId, setCandidateId] = useState(candidates[0]?.id || "");
  const [techScore, setTechScore] = useState(5);
  const [commScore, setCommScore] = useState(4);
  const [cultureScore, setCultureScore] = useState(5);
  const [recommendation, setRecommendation] = useState<"Strong Hire" | "Hire" | "No Hire" | "Strong No Hire">("Strong Hire");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");

  const handleAdd = () => {
    const cand = candidates.find((c) => c.id === candidateId) || candidates[0];
    addScorecard({
      candidateId: cand.id,
      interviewerName: "Current Interviewer",
      interviewerRole: "Lead Technical Evaluator",
      stage: cand.stage,
      ratings: [
        { criteria: "Technical Proficiency", score: techScore, comment: "Solid implementation speed." },
        { criteria: "Communication & Clarity", score: commScore, comment: "Articulate." },
        { criteria: "Cultural Alignment", score: cultureScore, comment: "High ownership." }
      ],
      overallRecommendation: recommendation,
      pros: pros || "Great depth in core technologies.",
      cons: cons || "None noted."
    });

    toast.success("Structured evaluation scorecard submitted!");
    setOpenModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Structured Evaluation Scorecards</h2>
          <p className="text-sm text-muted-foreground">
            Rubric ratings (1-5 stars), pros/cons feedback, overall recommendation (Strong Hire / No Hire).
          </p>
        </div>

        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5 gradient-bg shadow">
              <Plus className="w-4 h-4" /> Submit Scorecard
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Candidate Interview Evaluation Rubric</DialogTitle>
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

              <div className="space-y-3 bg-secondary/30 p-3 rounded-xl border border-border/40">
                <div className="flex justify-between items-center">
                  <Label>Technical Competency (1-5)</Label>
                  <Select value={String(techScore)} onValueChange={(val) => setTechScore(Number(val))}>
                    <SelectTrigger className="w-[100px] h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <SelectItem key={s} value={String(s)}>{s} Stars</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between items-center">
                  <Label>Communication & Clarity (1-5)</Label>
                  <Select value={String(commScore)} onValueChange={(val) => setCommScore(Number(val))}>
                    <SelectTrigger className="w-[100px] h-8"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <SelectItem key={s} value={String(s)}>{s} Stars</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Overall Recommendation</Label>
                <Select value={recommendation} onValueChange={(val: any) => setRecommendation(val)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strong Hire">Strong Hire ⭐⭐⭐⭐⭐</SelectItem>
                    <SelectItem value="Hire">Hire ⭐⭐⭐</SelectItem>
                    <SelectItem value="No Hire">No Hire</SelectItem>
                    <SelectItem value="Strong No Hire">Strong No Hire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Pros & Key Strengths</Label>
                <Textarea placeholder="What stood out positively..." value={pros} onChange={(e) => setPros(e.target.value)} rows={2} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button onClick={handleAdd}>Submit Scorecard</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Scorecards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scorecards.map((sc) => (
          <div key={sc.id} className="glass-card rounded-xl p-5 border border-border/50 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="text-[10px] font-mono mb-1">{sc.id}</Badge>
                <h3 className="font-bold text-base">{sc.interviewerName}</h3>
                <p className="text-xs text-muted-foreground">{sc.interviewerRole} · {sc.stage}</p>
              </div>
              <Badge className={`text-xs border ${
                sc.overallRecommendation.includes("Hire") ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-destructive/10 text-destructive"
              }`}>
                {sc.overallRecommendation}
              </Badge>
            </div>

            <div className="space-y-1.5 bg-secondary/30 p-3 rounded-lg text-xs">
              {sc.ratings.map((r, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{r.criteria}</span>
                  <div className="flex items-center gap-1 font-bold text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400" /> {r.score}/5
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs space-y-1 text-muted-foreground pt-1">
              <p><span className="font-semibold text-foreground">Pros:</span> {sc.pros}</p>
              <p><span className="font-semibold text-foreground">Cons:</span> {sc.cons}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
