import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Clock,
  IndianRupee,
  Briefcase,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardQuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Add Employee",
      description: "Onboard new staff",
      icon: UserPlus,
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-500",
      bgLight: "bg-blue-500/10 hover:bg-blue-500/15 border-blue-500/25",
      path: "/people",
    },
    {
      label: "Face Clock-In",
      description: "AI camera attendance",
      icon: Clock,
      color: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-500",
      bgLight: "bg-emerald-500/10 hover:bg-emerald-500/15 border-emerald-500/25",
      path: "/attendance",
    },
    {
      label: "Run Payroll",
      description: "Process monthly cycle",
      icon: IndianRupee,
      color: "from-purple-600 to-indigo-600",
      textColor: "text-purple-500",
      bgLight: "bg-purple-500/10 hover:bg-purple-500/15 border-purple-500/25",
      path: "/payroll",
    },
    {
      label: "Screen Resume (ATS)",
      description: "AI match analysis",
      icon: Briefcase,
      color: "from-amber-600 to-orange-600",
      textColor: "text-amber-500",
      bgLight: "bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/25",
      path: "/recruitment",
    },
    {
      label: "Team Connect",
      description: "Chat & announcements",
      icon: MessageSquare,
      color: "from-cyan-600 to-blue-600",
      textColor: "text-cyan-500",
      bgLight: "bg-cyan-500/10 hover:bg-cyan-500/15 border-cyan-500/25",
      path: "/connect",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.label}
            onClick={() => navigate(act.path)}
            className={`group flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer text-left ${act.bgLight} hover:scale-[1.02] shadow-xs`}
          >
            <div
              className={`w-9 h-9 rounded-lg bg-gradient-to-tr ${act.color} flex items-center justify-center text-white shadow-xs shrink-0 group-hover:scale-105 transition-transform`}
            >
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {act.label}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {act.description}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
