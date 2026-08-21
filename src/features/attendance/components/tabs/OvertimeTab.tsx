import { OvertimeHeader } from "./overtime/OvertimeHeader";
import { OvertimeTable } from "./overtime/OvertimeTable";
import type { OvertimeEntry } from "../../types/attendance.types";

export function OvertimeTab({ list, isManagerOrAbove, onRequestOvertime, onUpdate }: {
  list: OvertimeEntry[]; isManagerOrAbove: boolean; onRequestOvertime: () => void; onUpdate: (id: string, s: string) => void;
}) {
  return (
    <div className="space-y-3">
      <OvertimeHeader onRequestOvertime={onRequestOvertime} />
      <OvertimeTable list={list} isManagerOrAbove={isManagerOrAbove} onUpdate={onUpdate} />
    </div>
  );
}
