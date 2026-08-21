import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Employee } from "@/types/hr";
import { Building2, ChevronRight, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchEmployeeItemProps {
  employee: Employee;
  isSelected?: boolean;
  onSelect: (emp: Employee) => void;
}

export function SearchEmployeeItem({
  employee,
  isSelected,
  onSelect,
}: SearchEmployeeItemProps) {
  const name =
    employee.name ||
    employee.full_name ||
    (employee.firstName ? `${employee.firstName} ${employee.lastName || ""}`.trim() : "") ||
    "Employee";

  const initials = name
    .split(" ")
    .map((p: string) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "EM";

  const email = employee.email || employee.personalEmail || employee.companyWorkEmail || "";
  const department = employee.department || "General";
  const designation = employee.designation || employee.role || "Team Member";
  const empCode = employee.employeeId || employee.employeeCode || employee.id?.slice(0, 8);

  return (
    <div
      role="option"
      aria-selected={isSelected}
      onClick={() => onSelect(employee)}
      className={cn(
        "group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-150 border",
        isSelected
          ? "bg-primary/10 border-primary/30 shadow-sm"
          : "hover:bg-accent/60 border-transparent hover:border-border/40"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <Avatar className="h-9 w-9 border border-primary/20 shrink-0 shadow-xs">
          <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 space-y-0.5 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {name}
            </span>
            {empCode && (
              <span className="text-[11px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                #{empCode}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <span className="font-medium text-foreground/80">{designation}</span>
            <span className="text-muted-foreground/40">•</span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-muted-foreground/70" />
              {department}
            </span>
            {email && (
              <>
                <span className="text-muted-foreground/40 hidden sm:inline">•</span>
                <span className="hidden sm:flex items-center gap-1 text-muted-foreground truncate max-w-[160px]">
                  <Mail className="w-3 h-3 text-muted-foreground/70" />
                  {email}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        <Badge
          variant="outline"
          className="text-[11px] font-medium bg-secondary/50 text-secondary-foreground border-border/50 hidden sm:inline-flex"
        >
          {department}
        </Badge>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}
