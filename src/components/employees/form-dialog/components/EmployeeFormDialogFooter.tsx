import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

export function EmployeeFormDialogFooter({ isEdit, onCancel }: { isEdit: boolean; onCancel: () => void }) {
  return (
    <DialogFooter className="p-4 sm:p-5 border-t border-border/40 bg-secondary/30 flex flex-row items-center justify-between gap-3">
      <Button type="button" variant="outline" onClick={onCancel} className="text-xs h-9">
        Cancel
      </Button>
      <Button type="submit" className="gradient-bg text-primary-foreground font-bold text-xs h-9 shadow-md gap-1.5">
        <CheckCircle2 className="w-4 h-4" />
        <span>{isEdit ? "Save Employee Profile" : "Create Employee Profile"}</span>
      </Button>
    </DialogFooter>
  );
}
