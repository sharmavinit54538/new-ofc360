import { User } from "lucide-react";
import type { BasicInfoState } from "../types/basicInfoTypes";
import { BasicInfoNamesRow } from "./BasicInfoNamesRow";
import { BasicInfoDetailsRow } from "./BasicInfoDetailsRow";
import { BasicInfoAvatarField } from "./BasicInfoAvatarField";

export function BasicInfoSection({ basic }: { basic: BasicInfoState }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/40 pb-2">
        <User className="w-4 h-4 text-primary" />
        <span>1. Personal & Basic Information</span>
      </div>
      <BasicInfoNamesRow b={basic} />
      <BasicInfoDetailsRow b={basic} />
      <BasicInfoAvatarField b={basic} />
    </div>
  );
}
