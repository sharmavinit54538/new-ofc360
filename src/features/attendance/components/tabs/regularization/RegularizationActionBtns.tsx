import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export function RegularizationActionBtns({ id, onUpdate }: { id: string; onUpdate: (id: string, s: string) => void }) {
  return (
    <div className="flex justify-end gap-1">
      <Button onClick={() => onUpdate(id, "Approved")} size="sm" variant="ghost" className="h-6 w-6 p-0 text-emerald-600 hover:bg-emerald-500/10"><Check className="h-3.5 w-3.5" /></Button>
      <Button onClick={() => onUpdate(id, "Rejected")} size="sm" variant="ghost" className="h-6 w-6 p-0 text-rose-600 hover:bg-rose-500/10"><X className="h-3.5 w-3.5" /></Button>
    </div>
  );
}
