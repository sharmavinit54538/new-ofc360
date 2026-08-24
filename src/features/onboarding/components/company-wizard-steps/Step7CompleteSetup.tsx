import React from "react";
import { CheckCircle2, Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Step7CompleteSetupProps {
  isLoading: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export function Step7CompleteSetup({ isLoading, onSubmit, onBack }: Step7CompleteSetupProps) {
  return (
    <div className="space-y-6 text-center py-6">
      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-100">
        Ready to Finalize Onboarding Setup
      </h3>
      <p className="text-sm text-slate-400 max-w-md mx-auto">
        All 6 preceding setup steps are configured. Click below to activate tenant
        onboarding workspace.
      </p>

      <div className="flex justify-center gap-4 pt-4 border-t border-slate-800">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Review Step 6
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm rounded-lg transition-all shadow-lg shadow-emerald-950/40 flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Finalizing...
            </>
          ) : (
            <>
              Complete Onboarding <Sparkles className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}