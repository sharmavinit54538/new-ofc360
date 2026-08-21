import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AttendanceFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  searchPlaceholder?: string;
  statusOptions?: { label: string; value: string }[];
}

export function AttendanceFilters({
  searchQuery,
  onSearchChange,
  filterStatus,
  onStatusChange,
  onReset,
  searchPlaceholder = "Search employee, date, reason...",
  statusOptions = [
    { label: "All Statuses", value: "ALL" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
  ],
}: AttendanceFiltersProps) {
  const isFiltered = searchQuery.length > 0 || filterStatus !== "ALL";

  return (
    <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
      <div className="relative w-full sm:w-72">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 pl-8 text-xs bg-secondary/30 border-border/60"
        />
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Select value={filterStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="h-8 text-xs bg-secondary/30 border-border/60 w-36 font-medium">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
