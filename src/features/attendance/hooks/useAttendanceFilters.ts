import { useState, useMemo } from "react";
import type { RegularizationRequest } from "../types/attendance.types";

export function useAttendanceFilters(regularizations: RegularizationRequest[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRegularizations = useMemo(() => {
    return regularizations.filter((r) => {
      const matchSearch =
        r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || r.status.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [regularizations, searchQuery, statusFilter]);

  return { searchQuery, setSearchQuery, statusFilter, setStatusFilter, filteredRegularizations };
}
