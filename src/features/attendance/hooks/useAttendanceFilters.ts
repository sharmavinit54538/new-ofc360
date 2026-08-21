import { useState, useMemo } from "react";
import type { RegularizationRequest } from "../types/attendance.types";

export function useAttendanceFilters(regularizations: RegularizationRequest[]) {
  const [regFilterStatus, setRegFilterStatus] = useState<string>("ALL");
  const [regSearchQuery, setRegSearchQuery] = useState("");

  const filteredRegularizations = useMemo(() => {
    return regularizations.filter((r) => {
      const matchStatus = regFilterStatus === "ALL" || r.status === regFilterStatus;
      const matchSearch =
        r.employeeName.toLowerCase().includes(regSearchQuery.toLowerCase()) ||
        r.date.includes(regSearchQuery) ||
        r.reason.toLowerCase().includes(regSearchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [regularizations, regFilterStatus, regSearchQuery]);

  const resetFilters = () => {
    setRegSearchQuery("");
    setRegFilterStatus("ALL");
  };

  return {
    regFilterStatus,
    setRegFilterStatus,
    regSearchQuery,
    setRegSearchQuery,
    filteredRegularizations,
    resetFilters,
  };
}
