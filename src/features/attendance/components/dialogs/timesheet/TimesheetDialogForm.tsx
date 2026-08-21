import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function TimesheetDialogForm(p: {
  tsProject: string; setTsProject: (v: string) => void;
  tsHours: string; setTsHours: (v: string) => void;
  tsBillable: boolean; setTsBillable: (v: boolean) => void;
  tsTask: string; setTsTask: (v: string) => void;
}) {
  return (
    <div className="space-y-3 py-2">
      <div><Label className="text-xs">Project / Client Name</Label><Input value={p.tsProject} onChange={(e) => p.setTsProject(e.target.value)} placeholder="e.g. OFC360" className="h-8 text-xs mt-1" /></div>
      <div className="grid grid-cols-2 gap-2">
        <div><Label className="text-xs">Hours</Label><Input type="number" min="0.5" max="24" step="0.5" value={p.tsHours} onChange={(e) => p.setTsHours(e.target.value)} className="h-8 text-xs mt-1" /></div>
        <div className="flex items-center gap-2 pt-5"><input type="checkbox" id="billable" checked={p.tsBillable} onChange={(e) => p.setTsBillable(e.target.checked)} className="rounded border-border" /><Label htmlFor="billable" className="text-xs cursor-pointer">Billable</Label></div>
      </div>
      <div><Label className="text-xs">Task</Label><Textarea value={p.tsTask} onChange={(e) => p.setTsTask(e.target.value)} placeholder="Deliverables worked on..." className="text-xs mt-1 min-h-[60px]" /></div>
    </div>
  );
}
