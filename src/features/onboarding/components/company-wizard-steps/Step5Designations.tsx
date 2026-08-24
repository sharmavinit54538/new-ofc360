import React from "react";
import { Award, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface Step5DesignationsProps {
  designations: string[];
  setDesignations: React.Dispatch<React.SetStateAction<string[]>>;
  newDesig: string;
  setNewDesig: (desig: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export function Step5Designations({ designations, setDesignations, newDesig, setNewDesig, isLoading, onSubmit, onBack }: Step5DesignationsProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <Award className="w-5 h-5 text-indigo-400" /> Step 5: Configure Designations
      </h3>
      <div className="flex gap-2">
        <Input
          value={newDesig}
          onChange={(e) => setNewDesig(e.target.value)}
          placeholder="Add designation (e.g., Senior Developer)"
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
        />
        <Button
          type="button"
          onClick={() => {
            if (newDesig.trim()) {
              setDesignations([...designations, newDesig.trim()]);
              setNewDesig("");
            }
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
        {designations.map((desig, index) => (
          <div
            key={index}
            className="p-3 bg-slate-950/60 flex items-center justify-between"
          >
            <span className="text-sm font-medium text-slate-200">{desig}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setDesignations(designations.filter((_, i) => i !== index))}
              className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4 border-t border-slate-800">
        <Button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
        >
          Save & Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}