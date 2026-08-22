import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { EmployeeFormDialogProps } from "./form-dialog/types/dialogProps";
import { useEmployeeFormState } from "./form-dialog/hooks/useEmployeeFormState";
import { useEmployeeFormSubmit } from "./form-dialog/hooks/useEmployeeFormSubmit";
import { EmployeeFormDialogInner } from "./form-dialog/components/EmployeeFormDialogInner";

export default function EmployeeFormDialog({ open, onOpenChange, employee, onSave }: EmployeeFormDialogProps) {
  const state = useEmployeeFormState(employee, open);
  const handleSubmit = useEmployeeFormSubmit(employee, state, onSave, onOpenChange);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 rounded-2xl bg-card border border-border/70 overflow-hidden shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <EmployeeFormDialogInner employee={employee} state={state} onCancel={() => onOpenChange(false)} />
        </form>
      </DialogContent>
    </Dialog>
  );
}