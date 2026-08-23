import { useState } from "react";
import { useGetTeamFaceAttendanceQuery } from "@/services/api/faceAttendanceApi";

export function useTeamFaceAttendance(enabled: boolean) {
  const [teamPage, setTeamPage] = useState(1);
  const [teamSearch, setTeamSearch] = useState("");
  const [teamDate, setTeamDate] = useState("");
  const [teamStatus, setTeamStatus] = useState("all");

  const query = useGetTeamFaceAttendanceQuery(
    { page: teamPage, limit: 10, search: teamSearch || undefined, date: teamDate || undefined, status: teamStatus },
    { skip: !enabled }
  );

  return { teamPage, setTeamPage, teamSearch, setTeamSearch, teamDate, setTeamDate, teamStatus, setTeamStatus, ...query };
}
