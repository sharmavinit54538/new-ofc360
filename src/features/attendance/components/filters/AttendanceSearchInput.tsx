import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AttendanceSearchInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-8 h-8 text-xs bg-background/50 border-border/80"
      />
    </div>
  );
}
