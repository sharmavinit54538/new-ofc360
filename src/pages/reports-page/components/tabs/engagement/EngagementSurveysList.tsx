import { Badge } from "@/components/ui/badge";

export function EngagementSurveysList({ list }: { list?: any[] }) {
  const safeList = Array.isArray(list) ? list : [];
  if (safeList.length === 0) return null;
  return (
    <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
      <h3 className="font-bold text-sm text-foreground">Live & Completed Surveys</h3>
      <div className="space-y-2.5">
        {safeList.map((survey) => (
          <div key={survey.id} className="flex justify-between items-center p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-xs">
            <div>
              <p className="font-bold text-foreground">{survey.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Responses: {survey.responses} {survey.totalEligible ? `/ ${survey.totalEligible}` : ""}</p>
            </div>
            <Badge className={survey.status === "active" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold" : "bg-secondary text-muted-foreground"}>{survey.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
