import { useState } from "react";
import type { RegularizationRequest } from "../../types/attendance.types";

export function useRegModal() {
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regDate, setRegDate] = useState(new Date().toISOString().split("T")[0]);
  const [regType, setRegType] = useState<RegularizationRequest["missedPunchType"]>("Check-In");
  const [regTime, setRegTime] = useState("09:30");
  const [regReason, setRegReason] = useState("");

  return {
    isRegModalOpen, setIsRegModalOpen,
    regDate, setRegDate,
    regType, setRegType,
    regTime, setRegTime,
    regReason, setRegReason,
  };
}
