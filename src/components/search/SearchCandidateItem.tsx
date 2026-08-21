import { Badge } from "@/components/ui/badge";
import { BackendCandidateListItem } from "@/services/api/recruitment/recruitmentCandidateTypes";
import { Briefcase, ChevronRight, Mail, Sparkles, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchCandidateItemProps {
  candidate: BackendCandidateListItem;
  isSelected?: boolean;
  onSelect: (candidate: BackendCandidateListItem) => void;
}

export function SearchCandidateItem({
  candidate,
  isSelected,
  onSelect,
}: SearchCandidateItemProps) {
  const role = candidate.job_title || candidate.current_role || "Candidate";
  const atsScore = Math.round(candidate.ats_score || 0);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/25";
    if (score >= 60) return "text-amber-500 bg-amber-500/10 border-amber-500/25";
    return "text-blue-500 bg-blue-500/10 border-blue-500/25";
  };

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(candidate)}
      className={cn(
        "group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-150 border",
        isSelected
          ? "bg-primary/10 border-primary/30 shadow-sm"
          : "hover:bg-accent/60 border-transparent hover:border-border/40"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
          <UserCheck className="w-4 h-4" />
        </div>

        <div className="min-w-0 space-y-0.5 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {candidate.name}
            </span>
            {atsScore > 0 && (
              <span
                className={cn(
                  "flex items-center gap-1 text-[11px] font-mono font-bold px-1.5 py-0.5 rounded border",
                  getScoreColor(atsScore)
                )}
              >
                <Sparkles className="w-2.5 h-2.5" />
                {atsScore}% ATS
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1 font-medium text-foreground/80">
              <Briefcase className="w-3 h-3 text-muted-foreground/70" />
              {role}
            </span>
            {candidate.email && (
              <>
                <span className="text-muted-foreground/40 hidden sm:inline">•</span>
                <span className="hidden sm:flex items-center gap-1 text-muted-foreground truncate max-w-[160px]">
                  <Mail className="w-3 h-3 text-muted-foreground/70" />
                  {candidate.email}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        <Badge
          variant="outline"
          className="text-[11px] font-medium capitalize bg-secondary/50 text-secondary-foreground border-border/50 hidden sm:inline-flex"
        >
          {candidate.status || "Applied"}
        </Badge>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}
