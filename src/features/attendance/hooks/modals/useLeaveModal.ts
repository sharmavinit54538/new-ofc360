import { useState } from "react";

export function useLeaveModal() {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual Leave (CL)");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  return {
    isLeaveModalOpen, setIsLeaveModalOpen,
    leaveType, setLeaveType,
    leaveStart, setLeaveStart,
    leaveEnd, setLeaveEnd,
    leaveReason, setLeaveReason,
  };
}
