import { useState } from "react";

export function useShiftModal() {
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [shiftName, setShiftName] = useState("");
  const [shiftStart, setShiftStart] = useState("09:00");
  const [shiftEnd, setShiftEnd] = useState("18:00");
  const [shiftGrace, setShiftGrace] = useState("15");
  const [shiftDept, setShiftDept] = useState("Engineering");

  return {
    isShiftModalOpen, setIsShiftModalOpen,
    shiftName, setShiftName,
    shiftStart, setShiftStart,
    shiftEnd, setShiftEnd,
    shiftGrace, setShiftGrace,
    shiftDept, setShiftDept,
  };
}
