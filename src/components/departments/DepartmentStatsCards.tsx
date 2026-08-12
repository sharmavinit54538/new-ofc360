import { useGetDepartmentsQuery } from "@/services/api/departmentApi";
import { Building2, CheckCircle2, Users, UserPlus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function DepartmentStatsCards() {
  const { data: rawDepartments, isLoading } = useGetDepartmentsQuery();
  const departments = Array.isArray(rawDepartments) ? rawDepartments : [];

  const hasData = departments.length > 0;

  const totalDepts = isLoading ? "..." : hasData ? departments.length : 0;
  const activeDepts = isLoading
    ? "..."
    : hasData
    ? departments.filter((d) => d.status === "Active" || d.status === "Hiring" || d.status === "Growing").length
    : 0;
  const totalCapacity = isLoading
    ? "..."
    : hasData
    ? departments.reduce((acc, curr) => acc + (curr.capacity || 0), 0)
    : 0;
  const totalOpenPositions = isLoading
    ? "..."
    : hasData
    ? departments.reduce((acc, curr) => acc + (curr.openPositions || 0), 0)
    : 0;

  const cards = [
    {
      title: "Total Departments",
      value: totalDepts,
      subtitle: hasData ? "Configured units" : "No department data",
      icon: Building2,
    },
    {
      title: "Active Departments",
      value: activeDepts,
      subtitle: hasData ? "Operational status" : "No department data",
      icon: CheckCircle2,
    },
    {
      title: "Employee Capacity",
      subtitle: hasData ? "Total allocated seats" : "No department data",
      value: totalCapacity,
      icon: Users,
    },
    {
      title: "Open Hiring Positions",
      value: totalOpenPositions,
      subtitle: hasData ? "Active job requisitions" : "No department data",
      icon: UserPlus,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: idx * 0.05 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">{card.title}</p>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : card.value}
            </div>
            <p className="text-[11px] text-muted-foreground">{card.subtitle}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <card.icon className="w-5 h-5" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
