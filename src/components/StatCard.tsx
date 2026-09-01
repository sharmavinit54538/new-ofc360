import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

/**
 * ⚡ Bolt Performance Optimization:
 * Wrapped StatCard with React.memo() to prevent unnecessary re-renders.
 * StatCard is a pure presentational component used heavily across dynamic dashboards
 * (e.g., DashboardPage, AIPredictivePage, LandingPage).
 * Impact: Prevents wasted render cycles when parent components (like dashboards receiving live updates) re-render but individual stat props remain unchanged.
 */
export const StatCard = React.memo(function StatCard({ title, value, change, changeType = "neutral", icon: Icon, iconColor }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="stat-card glass-card-hover rounded-xl"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl ${iconColor || "bg-primary/10 border border-primary/20"}`}>
          <Icon className={`w-5 h-5 ${iconColor ? "text-primary-foreground" : "text-primary"}`} />
        </div>
      </div>
      {change && (
        <p className={`text-xs font-medium ${
          changeType === "up" ? "text-success" : changeType === "down" ? "text-destructive" : "text-muted-foreground"
        }`}>
          {change}
        </p>
      )}
    </motion.div>
  );
});