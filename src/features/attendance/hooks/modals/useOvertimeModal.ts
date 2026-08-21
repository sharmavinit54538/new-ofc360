import { useState } from "react";

export function useOvertimeModal() {
  const [isOvertimeModalOpen, setIsOvertimeModalOpen] = useState(false);
  const [otHours, setOtHours] = useState("2.5");
  const [otMultiplier, setOtMultiplier] = useState<string>("1.5x (Weekday)");
  const [otReason, setOtReason] = useState("");

  return {
    isOvertimeModalOpen, setIsOvertimeModalOpen,
    otHours, setOtHours,
    otMultiplier, setOtMultiplier,
    otReason, setOtReason,
  };
}
