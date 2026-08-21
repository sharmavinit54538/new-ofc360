import type { ReactNode } from "react";

interface AttendanceTableProps {
  children: ReactNode;
  className?: string;
}

export function AttendanceTable({ children, className = "" }: AttendanceTableProps) {
  return (
    <div className={`glass-card rounded-2xl overflow-hidden border border-border/60 bg-card ${className}`}>
      {children}
    </div>
  );
}
