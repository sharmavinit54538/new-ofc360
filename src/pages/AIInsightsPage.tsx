import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileSearch, Wand2, Calendar, UserPlus, ScanFace, CalendarOff, Calculator, MessageCircle, Heart, TrendingDown, BookOpen, Shield, DoorOpen, Camera, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Feature = {
  icon: any;
  label: string;
  desc: string;
  /** internal route to navigate to (if exists) */
  route?: string;
  /** demo kind opens an interactive modal */
  demo?: "ats" | "jd" | "schedule" | "onboarding" | "ocr" | "face" | "leave" | "salary" | "support" | "mental" | "attrition" | "skill" | "compliance" | "exit" | "ranking";
};

const features: Feature[] = [
  { icon: FileSearch, label: "Resume ATS Scoring", desc: "AI-powered applicant tracking score for every resume", route: "/ai/ats" },
  { icon: TrendingDown, label: "Candidate Ranking", desc: "Auto-rank candidates based on role compatibility", demo: "ranking" },
  { icon: Wand2, label: "JD Auto-Generator", desc: "Generate job descriptions from minimal input", demo: "jd" },
  { icon: Calendar, label: "AI Interview Scheduling", desc: "Smart scheduling based on availability patterns", demo: "schedule" },
  { icon: UserPlus, label: "Onboarding Automation", desc: "Automated workflows for new employee setup", route: "/onboarding" },
  { icon: ScanFace, label: "OCR Document Verification", desc: "Instant document scanning and validation", route: "/ai/documents" },
  { icon: Camera, label: "Face Attendance", desc: "Camera-based attendance verification", route: "/ai/cctv" },
  { icon: CalendarOff, label: "Leave Prediction", desc: "Predict leave patterns using historical data", demo: "leave" },
  { icon: Calculator, label: "Salary & Tax Calculator", desc: "Automated tax computation and salary structuring", demo: "salary" },
  { icon: MessageCircle, label: "Support Chatbot", desc: "AI-powered employee complaint resolution", route: "/ai-chat" },
  { icon: Heart, label: "Mental Health Bot", desc: "Confidential wellbeing check-ins and resources", demo: "mental" },
  { icon: TrendingDown, label: "Attrition Prediction", desc: "Identify flight-risk employees early", route: "/ai/predictive" },
  { icon: BookOpen, label: "Skill Gap Analysis", desc: "Recommend courses based on competency gaps", demo: "skill" },
  { icon: Shield, label: "Compliance Tracking", desc: "Monitor regulatory compliance across departments", route: "/compliance" },
  { icon: DoorOpen, label: "Exit Interview Bot", desc: "AI-conducted exit interviews with sentiment analysis", demo: "exit" },
];

function DemoBody({ kind }: { kind: NonNullable<Feature["demo"]> }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [input, setInput] = useState("");

  const run = (mock: any) => {
    setLoading(true);
    setResult(null);
    setTimeout(() => { setLoading(false); setResult(mock); toast.success("AI analysis complete"); }, 1100);
  };

  const ResultBlock = ({ children }: any) => (
    <div className="mt-4 p-4 rounded-lg bg-secondary/50 border border-border space-y-3 animate-fade-in">{children}</div>
  );

  switch (kind) {
    case "jd":
      return (
        <div className="space-y-2">
          <Input placeholder="Job title (e.g., Senior PM)" value={input} onChange={(e) => setInput(e.target.value)} />
          <Button className="w-full gap-1" disabled={loading} onClick={() => run({ jd: `### ${input || "Senior Engineer"}\n\nWe're hiring a ${input || "Senior Engineer"} to join our high-impact team. You'll own end-to-end delivery, mentor peers, and partner with cross-functional stakeholders.\n\n**Responsibilities**\n- Lead architecture & code quality\n- Mentor a team of 3-5\n- Drive measurable business outcomes\n\n**Requirements**\n- 5+ yrs experience\n- Strong system design\n- Excellent communication` })}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Generate JD
          </Button>
          {result && <ResultBlock><pre className="text-xs whitespace-pre-wrap">{result.jd}</pre></ResultBlock>}
        </div>
      );
    case "ranking":
      return (
        <div className="space-y-2">
          <Button className="w-full" disabled={loading} onClick={() => run({ list: [
            { n: "Aria Walker", s: 94 }, { n: "Marcus Lee", s: 89 }, { n: "Priya Nair", s: 86 }, { n: "Diego Romero", s: 78 }, { n: "Mei Tanaka", s: 71 }
          ]})}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Rank candidates</Button>
          {result && <ResultBlock>{result.list.map((c: any, i: number) => (
            <div key={c.n} className="flex items-center gap-3"><span className="text-xs font-mono w-5">#{i+1}</span><span className="flex-1 text-sm">{c.n}</span><Progress value={c.s} className="w-32 h-1.5" /><span className="text-xs font-mono w-8 text-right">{c.s}</span></div>
          ))}</ResultBlock>}
        </div>
      );
    case "schedule":
      return (
        <div className="space-y-2">
          <Input placeholder="Candidate email" />
          <Button className="w-full" disabled={loading} onClick={() => run({ slots: ["Mon 10:30", "Tue 14:00", "Wed 11:15"] })}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />} Find best slots</Button>
          {result && <ResultBlock><p className="text-xs text-muted-foreground mb-2">Best 3 slots based on panel availability:</p>{result.slots.map((s: string) => <Badge key={s} variant="secondary" className="mr-1.5">{s}</Badge>)}</ResultBlock>}
        </div>
      );
    case "leave":
      return (
        <div className="space-y-2">
          <Button className="w-full" disabled={loading} onClick={() => run({ pred: "Likely leave spike: 14-18 Aug (+34% above baseline). Cause: long weekend + Q3 wrap-up." })}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Predict leave pattern</Button>
          {result && <ResultBlock><p className="text-sm">{result.pred}</p></ResultBlock>}
        </div>
      );
    case "salary":
      return (
        <div className="space-y-2">
          <Input type="number" placeholder="CTC (annual, $)" value={input} onChange={(e) => setInput(e.target.value)} />
          <Button className="w-full" disabled={loading} onClick={() => {
            const ctc = Number(input) || 120000;
            run({ basic: ctc * 0.5, hra: ctc * 0.2, tax: ctc * 0.18, take: ctc * 0.62 });
          }}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Calculator className="w-4 h-4" />} Calculate</Button>
          {result && <ResultBlock>
            <div className="grid grid-cols-2 gap-2 text-sm"><span className="text-muted-foreground">Basic</span><span className="font-mono text-right">${result.basic.toLocaleString()}</span><span className="text-muted-foreground">HRA</span><span className="font-mono text-right">${result.hra.toLocaleString()}</span><span className="text-muted-foreground">Tax</span><span className="font-mono text-right text-destructive">-${result.tax.toLocaleString()}</span><span className="font-semibold">Take Home</span><span className="font-mono text-right font-semibold text-success">${result.take.toLocaleString()}</span></div>
          </ResultBlock>}
        </div>
      );
    case "mental":
      return (
        <div className="space-y-2">
          <Textarea placeholder="How are you feeling today?" value={input} onChange={(e) => setInput(e.target.value)} rows={3} />
          <Button className="w-full" disabled={loading || !input} onClick={() => run({ msg: "Thanks for sharing. It sounds like you're carrying a lot right now. Try a 5-minute breathing exercise — and remember, our EAP is available 24/7. Would you like me to book a confidential session?" })}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />} Check in</Button>
          {result && <ResultBlock><p className="text-sm">{result.msg}</p></ResultBlock>}
        </div>
      );
    case "skill":
      return (
        <div className="space-y-2">
          <Button className="w-full" disabled={loading} onClick={() => run({ gaps: [{s: "System Design", g: 35}, {s: "LLM Ops", g: 60}, {s: "Leadership", g: 25}] })}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Analyze skills</Button>
          {result && <ResultBlock>{result.gaps.map((g: any) => (
            <div key={g.s}><div className="flex justify-between text-xs mb-1"><span>{g.s}</span><span className="font-mono">gap {g.g}%</span></div><Progress value={100-g.g} className="h-1.5" /></div>
          ))}</ResultBlock>}
        </div>
      );
    case "exit":
      return (
        <div className="space-y-2">
          <Textarea placeholder="What's prompting you to leave?" value={input} onChange={(e) => setInput(e.target.value)} rows={3} />
          <Button className="w-full" disabled={loading || !input} onClick={() => run({ sentiment: "Negative", score: 28, themes: ["Manager", "Growth", "Compensation"] })}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <DoorOpen className="w-4 h-4" />} Analyze response</Button>
          {result && <ResultBlock>
            <div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Sentiment:</span><Badge variant="outline" className="border-destructive/40 text-destructive">{result.sentiment}</Badge><span className="font-mono text-xs">{result.score}/100</span></div>
            <div className="flex flex-wrap gap-1.5">{result.themes.map((t: string) => <Badge key={t} variant="secondary">{t}</Badge>)}</div>
          </ResultBlock>}
        </div>
      );
    default:
      return <p className="text-sm text-muted-foreground">Demo coming soon.</p>;
  }
}

export default function AIInsightsPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState<Feature | null>(null);

  const handleClick = (f: Feature) => {
    if (f.route) { navigate(f.route); return; }
    setActive(f);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="page-header">AI Features & Insights</h1>
        <p className="page-subheader">Click any feature to launch the AI module</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => (
          <motion.button
            key={f.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => handleClick(f)}
            className="glass-card-hover rounded-xl p-5 group cursor-pointer text-left"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{f.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="mt-3">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {f.route ? "Open Module" : "Try Demo"}
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-md">
          {active && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="p-1.5 rounded-md bg-primary/10"><active.icon className="w-4 h-4 text-primary" /></span>
                  {active.label}
                </DialogTitle>
                <DialogDescription>{active.desc}</DialogDescription>
              </DialogHeader>
              {active.demo && <DemoBody kind={active.demo} />}
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}