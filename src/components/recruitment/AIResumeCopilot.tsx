import { useState } from "react";
import { Sparkles, FileText, Send, CheckCircle2, MessageSquare, Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useATSStore } from "@/stores/atsStore";
import { toast } from "sonner";

export function AIResumeCopilot() {
  const { candidates } = useATSStore();
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidates[0]?.id || "");
  const [generatedQuestions, setGeneratedQuestions] = useState<string[]>([]);
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedCand = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const handleGenerateQuestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedQuestions([
        `1. Can you explain your architecture design choices when scaling high-throughput APIs for ${selectedCand?.jobTitle || "this role"}?`,
        `2. I noticed you worked with ${selectedCand?.skills[0] || "React"} at ${selectedCand?.currentCompany || "your previous company"}. What state management pattern did you adopt for complex component trees?`,
        `3. How do you approach cross-functional communication when product scope changes during a sprint?`
      ]);
      toast.success("AI interview questions tailored to candidate resume generated!");
    }, 1000);
  };

  const handleGenerateOutreach = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedEmail(
        `Hi ${selectedCand?.firstName},\n\nI came across your impressive experience as a ${selectedCand?.currentRole} at ${selectedCand?.currentCompany}. Given your strong proficiency in ${selectedCand?.skills.slice(0, 3).join(", ")}, we'd love to schedule a quick 20-minute chat regarding the ${selectedCand?.jobTitle} role at NeuraCore.\n\nLet me know your availability for this week!`
      );
      toast.success("AI personalized outreach email draft created!");
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Copilot Header */}
      <div className="glass-card p-6 rounded-xl border border-purple-500/20 bg-purple-500/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl gradient-bg text-primary-foreground">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">AI Resume Intelligence & Copilot</h2>
            <p className="text-sm text-muted-foreground">
              Auto-generate interview scorecards, customized questions, and personalized outreach sequences.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Select Candidate Column */}
        <div className="glass-card rounded-xl p-5 border border-border/50 space-y-4">
          <h3 className="font-bold text-sm">Select Candidate to Analyze</h3>
          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
            {candidates.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCandidateId(c.id)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors text-xs space-y-1 ${
                  selectedCandidateId === c.id ? "bg-primary/10 border-primary" : "bg-secondary/20 border-border/40 hover:bg-secondary/40"
                }`}
              >
                <div className="flex justify-between font-bold">
                  <span>{c.firstName} {c.lastName}</span>
                  <Badge variant="outline" className="text-[10px] text-primary">{c.aiMatchScore}% Fit</Badge>
                </div>
                <p className="text-muted-foreground">{c.jobTitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Generator Panel */}
        <div className="lg:col-span-2 space-y-6">
          {selectedCand && (
            <div className="glass-card rounded-xl p-6 border border-border/50 space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-border/40">
                <div>
                  <h3 className="font-bold text-base">{selectedCand.firstName} {selectedCand.lastName}</h3>
                  <p className="text-xs text-muted-foreground">Applied for {selectedCand.jobTitle}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleGenerateQuestions} disabled={isGenerating} className="text-xs gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Gen Questions
                  </Button>
                  <Button size="sm" onClick={handleGenerateOutreach} disabled={isGenerating} className="text-xs gap-1.5 gradient-bg">
                    <MessageSquare className="w-3.5 h-3.5" /> AI Draft Outreach
                  </Button>
                </div>
              </div>

              {/* Generated Interview Questions */}
              {generatedQuestions.length > 0 && (
                <div className="space-y-2 bg-secondary/30 p-4 rounded-xl border border-border/40 text-xs">
                  <h4 className="font-bold text-primary flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Customized Interview Questions:
                  </h4>
                  {generatedQuestions.map((q, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed">{q}</p>
                  ))}
                </div>
              )}

              {/* Generated Email Draft */}
              {generatedEmail && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs">Personalized Candidate Outreach Email</h4>
                  <Textarea value={generatedEmail} onChange={(e) => setGeneratedEmail(e.target.value)} rows={6} className="text-xs font-mono" />
                  <Button size="sm" onClick={() => toast.success("Email sent to candidate inbox!")} className="gap-1 text-xs">
                    Send Email via Copilot Mailer <Send className="w-3.5 h-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
