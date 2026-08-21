import { LeavesHeader } from "./leaves/LeavesHeader";
import { LeavesTable } from "./leaves/LeavesTable";
import type { DisplayedLeave } from "../../types/attendance.types";

export function LeavesTab({ list, isManagerOrAbove, onApplyLeave, onReview }: {
  list: DisplayedLeave[]; isManagerOrAbove: boolean; onApplyLeave: () => void; onReview: (id: string, s: "Approved" | "Denied") => void;
}) {
  return (
    <div className="space-y-3">
      <LeavesHeader onApplyLeave={onApplyLeave} />
      <LeavesTable list={list} isManagerOrAbove={isManagerOrAbove} onReview={onReview} />
    </div>
  );
}
