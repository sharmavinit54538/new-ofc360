import { useState } from "react";

export function useRosterModal() {
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [rosterEmp, setRosterEmp] = useState("");
  const [rosterShift, setRosterShift] = useState("General Shift [9AM - 6PM]");
  const [rosterDay, setRosterDay] = useState("Monday");

  return {
    isRosterModalOpen, setIsRosterModalOpen,
    rosterEmp, setRosterEmp,
    rosterShift, setRosterShift,
    rosterDay, setRosterDay,
  };
}
