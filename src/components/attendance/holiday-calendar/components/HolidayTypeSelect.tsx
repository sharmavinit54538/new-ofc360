import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HOLIDAY_TYPE_OPTIONS } from "../constants/holidayTypeOptions";

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function HolidayTypeSelect({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 text-xs bg-secondary/30 border-border/60 w-36 font-medium">
        <SelectValue placeholder="All Categories" />
      </SelectTrigger>
      <SelectContent>
        {HOLIDAY_TYPE_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
