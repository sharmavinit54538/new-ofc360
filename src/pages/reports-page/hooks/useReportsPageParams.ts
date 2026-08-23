import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useReportsPageParams(hasRecords: boolean) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get("tab") || "workforce";
  const [dateRange, setDateRange] = useState("Q2-2026");

  const setTab = (tab: string) => setSearchParams({ tab });

  const handleExport = (format: string) => {
    if (!hasRecords) return toast.error("No active records available to export.");
    toast.success(`Exporting ${activeTab.toUpperCase()} report as ${format}...`, { duration: 1800 });
  };

  return { activeTab, setTab, dateRange, setDateRange, navigate, handleExport };
}
