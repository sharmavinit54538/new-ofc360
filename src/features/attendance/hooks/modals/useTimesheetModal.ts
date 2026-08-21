import { useState } from "react";

export function useTimesheetModal() {
  const [isTimesheetModalOpen, setIsTimesheetModalOpen] = useState(false);
  const [tsProject, setTsProject] = useState("");
  const [tsTask, setTsTask] = useState("");
  const [tsHours, setTsHours] = useState("8");
  const [tsBillable, setTsBillable] = useState(true);

  return {
    isTimesheetModalOpen, setIsTimesheetModalOpen,
    tsProject, setTsProject,
    tsTask, setTsTask,
    tsHours, setTsHours,
    tsBillable, setTsBillable,
  };
}
