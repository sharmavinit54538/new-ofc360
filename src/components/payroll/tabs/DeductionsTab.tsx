import { motion } from "framer-motion";
import { Plus, Loader2, MinusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../PayrollContext";

export function DeductionsTab() {
  const {
    setIsDedModalOpen,
    isDeductionsLoading,
    deductionsList,
    handleDeleteDeduction,
    isDeletingDeduction,
  } = usePayrollContext();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Deductions & Statutory Benefit Rules</h2>
          <p className="text-xs text-muted-foreground">Provident Fund (PF 12%), ESI (0.75%), PT and voluntary NPS contributions.</p>
        </div>
        <Button onClick={() => setIsDedModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
          <Plus className="w-4 h-4" /> Add Statutory Deduction
        </Button>
      </div>

      {isDeductionsLoading ? (
        <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-border/40 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">Loading deduction rules...</p>
        </div>
      ) : deductionsList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
          <MinusCircle className="w-8 h-8 mx-auto text-muted-foreground/40" />
          <h4 className="font-bold text-sm text-foreground">No Statutory Deductions Configured</h4>
          <p className="text-xs text-muted-foreground">Click "+ Add Statutory Deduction" to set up PF, ESI, or PT rules.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deductionsList.map((d: any) => (
            <div key={d.id} className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground">{d.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteDeduction(d.id)}
                  disabled={isDeletingDeduction}
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="space-y-1.5 p-3 rounded-xl bg-secondary/30 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deduction Type</span>
                  <span className="font-semibold text-foreground">{d.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rate Value</span>
                  <span className="font-mono font-bold text-destructive">
                    {d.value ?? d.ratePercentage ?? 12}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statutory Mandatory</span>
                  <span className="font-bold text-emerald-500">
                    {d.is_mandatory || d.mandatory ? "Yes" : "Optional"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
