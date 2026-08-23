import { useState } from "react";
import { useGetMyFaceAttendanceQuery, useGetFaceAttendanceAnalyticsQuery } from "@/services/api/faceAttendanceApi";
import { useFaceAttendanceAuth } from "./useFaceAttendanceAuth";
import { usePersonalHistory } from "./usePersonalHistory";
import { useTeamFaceAttendance } from "./useTeamFaceAttendance";
import { useCompanyFaceAttendance } from "./useCompanyFaceAttendance";
import type { ModalMode } from "../types/faceAttendanceTypes";

export function useFaceAttendanceData() {
  const auth = useFaceAttendanceAuth();
  const [activeTab, setActiveTab] = useState("history");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("check-in");
  const me = useGetMyFaceAttendanceQuery();
  const hist = usePersonalHistory();
  const team = useTeamFaceAttendance(auth.isManagerOrAbove);
  const comp = useCompanyFaceAttendance(auth.isHrOrAdmin);
  const analytics = useGetFaceAttendanceAnalyticsQuery(undefined, { skip: !auth.isManagerOrAbove });
  return { auth, activeTab, setActiveTab, isModalOpen, setIsModalOpen, modalMode, setModalMode, me, hist, team, comp, analytics };
}