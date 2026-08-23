import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WorkforceEmptyState({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-3">
      <Users className="w-10 h-10 mx-auto text-muted-foreground/40" />
      <h4 className="font-bold text-base text-foreground">No Employee Records Found</h4>
      <p className="text-xs text-muted-foreground max-w-md mx-auto">Add employees to your organization directory to generate live headcount charts.</p>
      <Button size="sm" onClick={onNavigate} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5"><Plus className="w-4 h-4" /> Add First Employee</Button>
    </div>
  );
}
