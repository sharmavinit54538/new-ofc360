import { useMemo } from "react";
import { ArrowRight, Sparkles, UserX } from "lucide-react";
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
  const safeCandidates = Array.isArray(candidates) ? candidates : [];
  const displayCandidates = safeCandidates.slice(0, 5);

  const avgScore = useMemo(() => {
    if (safeCandidates.length === 0) return null;
    const scores = safeCandidates.map((c) => c.aiScore || c.ats_score || c.match_score || 0).filter((s) => s > 0);
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }, [safeCandidates]);

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
              {safeCandidates.length} Candidates Evaluated
            </Badge>
            <Link to="/recruitment">
              <Button size="sm" variant="ghost" className="h-7 text-xs px-2 gap-1 text-primary hover:bg-primary/10">
                <span>Open ATS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {displayCandidates.length === 0 ? (
          <div className="p-8 text-center space-y-2 border border-dashed border-border/50 rounded-lg bg-muted/10 my-2">
            <UserX className="w-8 h-8 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-semibold text-foreground">No candidate applications yet</p>
            <p className="text-xs text-muted-foreground">
              Applicants submitted through the careers portal will be analyzed by the ATS scoring engine.
            </p>
          </div>
        ) : (
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
                  const score = c.aiScore || c.ats_score || c.match_score || 0;
                  return (
                    <TableRow key={c.id || c.candidate_id} className="hover:bg-secondary/30 transition-colors">
                      <TableCell>
                        <div className="text-xs font-semibold text-foreground">{c.name}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {c.role || c.job_title || "Applicant"} • {c.experience || (c.years_experience ? `${c.years_experience} yrs` : "—")}
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
                          <span className="text-xs font-bold text-primary font-mono">{score > 0 ? `${score}%` : "—"}</span>
                          {score > 0 && (
                            <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden hidden sm:block">
                              <div
                                className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border/40 mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>{avgScore ? `Average ATS relevance: ${avgScore}%` : "ATS Engine Active"}</span>
        <Link to="/recruitment" className="text-primary hover:underline font-medium">
          Source & Screen Candidates ➔
        </Link>
      </div>
    </div>
  );
}
