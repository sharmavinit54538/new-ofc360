import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function HolidaySearchBar({ value, onChange }: Props) {
  return (
    <div className="relative w-full md:w-72">
      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <Input placeholder="Search holiday name or date..." value={value} onChange={(e) => onChange(e.target.value)} className="h-8 pl-8 text-xs bg-secondary/30 border-border/60" />
    </div>
  );
}
