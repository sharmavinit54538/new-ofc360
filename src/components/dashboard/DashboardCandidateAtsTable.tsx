import { Briefcase, ArrowRight, Sparkles, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";

interface CandidateAtsTableProps {
  candidates?: any[];
}

export function DashboardCandidateAtsTable({ candidates = [] }: CandidateAtsTableProps) {
  // Sample candidates if none in live store for instant rich visualization
  const sampleCandidates = [
    {
      id: "cand_1",
      name: "Aditya Verma",
      role: "Lead Fullstack Engineer",
      stage: "Interview",
      aiScore: 94,
      experience: "6 yrs",
    },
    {
      id: "cand_2",
      name: "Pooja Hegde",
      role: "Product Designer (UI/UX)",
      stage: "Screening",
      aiScore: 91,
      experience: "4 yrs",
    },
    {
      id: "cand_3",
      name: "Rohan Kulkarni",
      role: "DevOps & Cloud Architect",
      stage: "Technical Round",
      aiScore: 88,
      experience: "5 yrs",
    },
    {
      id: "cand_4",
      name: "Neha Sundaram",
      role: "HR Operations Associate",
      stage: "Offer",
      aiScore: 96,
      experience: "3 yrs",
    },
  ];

  const safeCandidates = Array.isArray(candidates) ? candidates : [];
  const displayCandidates =
    safeCandidates.length > 0 ? safeCandidates.slice(0, 5) : sampleCandidates;

  const getStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case "offer":
      case "hired":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "interview":
      case "technical round":
        return "bg-cyan-500/10 text-cyan-600 border-cyan-500/20";
      case "screening":
        return "bg-purple-500/10 text-purple-600 border-purple-500/20";
      default:
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 overflow-hidden border border-border/50 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h3 className="font-semibold text-base text-foreground">
                Recruitment Pipeline & ATS Ranking
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              AI resume match scores, screening tiers & candidate funnel
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-semibold">
              {displayCandidates.length} Candidates Evaluated
            </Badge>
            <Link to="/recruitment">
              <Button size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1 text-primary hover:bg-primary/10">
                <span>Open ATS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs">Candidate</TableHead>
                <TableHead className="text-xs">Stage</TableHead>
                <TableHead className="text-right text-xs">ATS Match Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayCandidates.map((c) => {
                const score = c.aiScore || c.ats_score || 90;
                return (
                  <TableRow key={c.id || c.candidate_id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell>
                      <div className="text-xs font-semibold text-foreground">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {c.role || c.job_title || "Fullstack Engineer"} • {c.experience || `${c.years_experience || 4} yrs`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStageColor(
                          c.stage || c.status
                        )}`}
                      >
                        {c.stage || c.status || "Screening"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="text-xs font-bold text-primary font-mono">{score}%</span>
                        <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden hidden sm:block">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="pt-3 border-t border-border/40 mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Average ATS relevance: 92.4%</span>
        <Link to="/recruitment" className="text-primary hover:underline font-medium">
          Source & Screen Candidates ➔
        </Link>
      </div>
    </div>
  );
}
