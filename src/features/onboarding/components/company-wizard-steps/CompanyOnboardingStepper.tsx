import React from "react";
import { Building2, UserCheck, Settings2, Network, Award, UserPlus, CheckCircle2, Sparkles } from "lucide-react";

interface Step {
  step: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CompanyOnboardingStepperProps {
  currentWizardStep: number;
  onStepClick: (step: number) => void;
  progressPercent: number;
}

const STEPS: Step[] = [
  { step: 1, title: "Company Profile", icon: Building2 },
  { step: 2, title: "Admin Profile", icon: UserCheck },
  { step: 3, title: "HR Settings", icon: Settings2 },
  { step: 4, title: "Departments", icon: Network },
  { step: 5, title: "Designations", icon: Award },
  { step: 6, title: "Invite Employees", icon: UserPlus },
  { step: 7, title: "Complete Setup", icon: CheckCircle2 },
];

export function CompanyOnboardingStepper({ currentWizardStep, onStepClick, progressPercent }: CompanyOnboardingStepperProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
      {STEPS.map((s) => {
        const Icon = s.icon;
        const isActive = currentWizardStep === s.step;
        const isDone = currentWizardStep > s.step;
        return (
          <button
            key={s.step}
            onClick={() => onStepClick(s.step)}
            className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium text-center ${
              isActive
                ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-md shadow-indigo-950/40"
                : isDone
                ? "bg-slate-800/40 border-emerald-500/30 text-emerald-400"
                : "bg-slate-950/40 border-slate-800/80 text-slate-500 hover:border-slate-700"
            }`}
          >
            <div
              className={`p-1.5 rounded-lg ${
                isActive
                  ? "bg-indigo-500 text-white"
                  : isDone
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <span className="truncate w-full">{s.title}</span>
          </button>
        );
      })}
    </div>
  );
}