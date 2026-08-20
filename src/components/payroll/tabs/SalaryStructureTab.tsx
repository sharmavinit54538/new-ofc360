import { motion } from "framer-motion";
import { Plus, Trash2, Layers, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollContext } from "../PayrollContext";

export function SalaryStructureTab() {
  const {
    setIsStructModalOpen,
    isStructuresLoading,
    structuresList,
    handleDeleteStructure,
    isDeletingStructure,
    fmt,
  } = usePayrollContext();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Salary Structures & Grade CTC Builder</h2>
          <p className="text-xs text-muted-foreground">Define Basic, HRA, DA, and Special Allowance percentages for employee grades.</p>
        </div>
        <Button onClick={() => setIsStructModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
          <Plus className="w-4 h-4" /> Add Grade Band Structure
        </Button>
      </div>

      {isStructuresLoading ? (
        <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-border/40 space-y-2">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          <p className="text-xs text-muted-foreground">Loading salary grade templates from backend...</p>
        </div>
      ) : structuresList.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
          <Layers className="w-8 h-8 mx-auto text-muted-foreground/40" />
          <h4 className="font-bold text-sm text-foreground">No CTC Grade Structures Defined</h4>
          <p className="text-xs text-muted-foreground">Click "+ Add Grade Band Structure" to configure salary breakdown templates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {structuresList.map((s: any) => (
            <div key={s.id} className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-foreground">{s.name || s.gradeName || "Senior Engineer Grade"}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteStructure(s.id)}
                  disabled={isDeletingStructure}
                  className="h-7 w-7 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div className="space-y-1.5 p-3 rounded-xl bg-secondary/30 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Basic Salary</span>
                  <span className="font-mono font-bold text-foreground">{s.basicPct || 50}% CTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">HRA</span>
                  <span className="font-mono text-foreground">{s.hraPct || 20}% CTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Special Allowance</span>
                  <span className="font-mono text-foreground">{s.specialAllowancePct || 20}% CTC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Payout</span>
                  <span className="font-mono text-primary font-bold">{fmt(s.base_salary || 100000)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
