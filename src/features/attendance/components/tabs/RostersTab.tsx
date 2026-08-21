import { RostersHeader } from "./rosters/RostersHeader";
import { RostersTable } from "./rosters/RostersTable";
import type { RosterItem } from "../../types/attendance.types";

export function RostersTab({ rosters, onAssignRoster, onDeleteRoster }: {
  rosters: RosterItem[]; onAssignRoster: () => void; onDeleteRoster: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      <RostersHeader onAssignRoster={onAssignRoster} />
      <RostersTable rosters={rosters} onDelete={onDeleteRoster} />
    </div>
  );
}
