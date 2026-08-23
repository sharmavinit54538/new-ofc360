import { useState } from "react";
import { useGetPersonalFaceHistoryQuery } from "@/services/api/faceAttendanceApi";

export function usePersonalHistory() {
  const [historyPage, setHistoryPage] = useState(1);
  const [historyStatus, setHistoryStatus] = useState("all");
  const [historyMonth, setHistoryMonth] = useState(new Date().toISOString().slice(0, 7));

  const query = useGetPersonalFaceHistoryQuery({
    page: historyPage,
    limit: 10,
    status: historyStatus,
    month: historyMonth,
  });

  return { historyPage, setHistoryPage, historyStatus, setHistoryStatus, historyMonth, setHistoryMonth, ...query };
}
