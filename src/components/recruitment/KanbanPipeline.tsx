import { useState } from "react";
import { motion } from "framer-motion";
import { UserCheck, Star, MoveRight, ThumbsUp, ThumbsDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useATSStore } from "@/stores/atsStore";
import { CandidateStage, Candidate } from "@/types/ats";
import { toast } from "sonner";

const STAGES: CandidateStage[] = [
  "Applied",
  "Screening",
  "Tech Interview",
  "Culture Round",
  "Offer Extended",
  "Hired",
  "Rejected"
];

export function KanbanPipeline() {
  const { candidates, updateCandidateStage, setSelectedCandidateId } = useATSStore();
  const [draggedCandidateId, setDraggedCandidateId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedCandidateId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetStage: CandidateStage) => {
    if (!draggedCandidateId) return;
    const cand = candidates.find((c) => c.id === draggedCandidateId);
    if (cand && cand.stage !== targetStage) {
      updateCandidateStage(draggedCandidateId, targetStage);
      toast.success(`Moved ${cand.firstName} ${cand.lastName} to "${targetStage}" stage!`);
    }
    setDraggedCandidateId(null);
  };

  return (
    <div className="space-y-4 overflow-x-auto pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Interactive Drag & Drop Recruitment Pipeline</h2>
          <p className="text-sm text-muted-foreground">
            Seamlessly drag candidate cards across stage columns to trigger automated workflows.
          </p>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-flow-col auto-cols-[280px] gap-4 min-h-[550px]">
        {STAGES.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.stage === stage);
          return (
            <div
              key={stage}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage)}
              className="glass-card rounded-xl p-3 border border-border/40 bg-secondary/20 flex flex-col space-y-3"
            >
              {/* Stage Header */}
              <div className="flex justify-between items-center px-1">
                <span className="font-semibold text-xs text-foreground uppercase tracking-wider">{stage}</span>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  {stageCandidates.length}
                </Badge>
              </div>

              {/* Cards Container */}
              <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[500px] pr-1">
                {stageCandidates.length === 0 ? (
                  <div className="h-24 border border-dashed border-border/40 rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                    Drop candidates here
                  </div>
                ) : (
                  stageCandidates.map((c) => (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={() => handleDragStart(c.id)}
                      onClick={() => setSelectedCandidateId(c.id)}
                      className="glass-card-hover rounded-lg p-3 border border-border/50 bg-background/80 cursor-grab active:cursor-grabbing space-y-2 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-xs hover:text-primary transition-colors">
                            {c.firstName} {c.lastName}
                          </h4>
                          <p className="text-[11px] text-muted-foreground">{c.jobTitle}</p>
                        </div>
                        <Badge className="bg-primary/10 text-primary text-[10px] border-primary/20">
                          {c.aiMatchScore}% Match
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-1 border-t border-border/30">
                        <span>{c.source}</span>
                        <div className="flex items-center gap-1 text-amber-400 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" /> {c.rating}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
