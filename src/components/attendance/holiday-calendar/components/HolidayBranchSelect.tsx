import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HOLIDAY_BRANCH_OPTIONS } from "../constants/holidayBranchOptions";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function HolidayBranchSelect({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-xs bg-secondary/30 border-border/60 w-40 font-medium">
        <SelectValue placeholder="All Branches" />
      </SelectTrigger>
      <SelectContent>
        {HOLIDAY_BRANCH_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
