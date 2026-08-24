import { Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function PerformanceSkillGaps({ list }: { list?: any[] }) {
  const safeList = Array.isArray(list) ? list : [];
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
      <h3 className="font-bold text-sm text-foreground flex items-center gap-2"><Target className="w-4 h-4 text-amber-500" /> AI Skill Gap Analysis</h3>
      {safeList.length > 0 ? (
        <div className="space-y-3">
          {safeList.map((gap, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs space-y-1.5">
              <div className="flex justify-between font-medium"><span className="font-bold text-foreground">{gap.skill}</span><span className="text-amber-500 font-semibold">{gap.affectedEmployees} affected</span></div>
              <Progress value={Math.min(100, (gap.currentLevel / (gap.requiredLevel || 1)) * 100)} className="h-1.5" />
            </div>
          ))}
        </div>
      ) : <p className="text-xs text-muted-foreground py-4 text-center">No skill gaps detected</p>}
    </div>
  );
}
