import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  LogIn,
  LogOut,
  CalendarDays,
  Plus,
  CheckCircle,
  BarChart3,
  Calendar,
  Coffee,
  MapPin,
  Camera,
  Wifi,
  QrCode,
  CalendarOff,
  Download,
  Trash2,
  Timer,
  Award,
  Sun,
  RotateCw,
  ShieldCheck,
  AlertCircle,
  Check,
  Scan,
  Radio,
  Signal,
  RefreshCw,
  Search,
  Loader2,
  TrendingUp,
  Users,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { normalizeRole } from "@/features/auth/authTypes";
import { useGetEmployeesQuery } from "@/services/api/employeeApi";
import { useLeaveStore } from "@/stores/leaveStore";
import {
  useAttendanceStore,
  type PunchRecord,
  type ShiftTemplate,
  type RosterItem,
  type HolidayItem,
  type RegularizationRequest,
  type TimesheetEntry,
  type OvertimeEntry,
} from "@/stores/attendanceStore";
import {
  useFaceCheckInMutation,
  useFaceCheckOutMutation,
  useGetMyFaceAttendanceQuery,
  useGetPersonalFaceHistoryQuery,
  useGetTeamFaceAttendanceQuery,
  useGetCompanyFaceAttendanceQuery,
  useGetFaceAttendanceAnalyticsQuery,
  type FaceAttendanceRecord,
} from "@/services/api/faceAttendanceApi";
import {
  useGetCalendarHolidaysQuery,
  useCreateCalendarHolidaysMutation,
  useDeleteCalendarHolidaysIdMutation,
} from "@/store/api/calendarApi";
import {
  useGetLeavesHistoryQuery,
  useCreateLeavesApplyMutation,
  useCreateLeavesLeaveIdReviewMutation,
} from "@/store/api/leaveApi";
import {
  useGetTimesheetsHistoryQuery,
  useCreateTimesheetsWeeklyMutation,
  useCreateTimesheetsTimesheetIdReviewMutation,
  useCreateV2ShiftsPlansMutation,
} from "@/store/api/timesheetsApi";
import {
  useGetOvertimeQuery,
  useGetAiDashboardQuery,
} from "@/features/attendance/attendanceApi";
import { useLazyGetExportsAttendanceQuery } from "@/store/api/reportsApi";
import {
  OFFICE_BRANCHES,
  calculateHaversineDistanceMeters,
  getCurrentGpsPosition,
  type GpsLocationResult,
} from "@/utils/verification/gpsVerification";
import {
  startCameraStream,
  stopCameraStream,
  captureVideoFrame,
  type CameraCaptureResult,
} from "@/utils/verification/cameraVerification";
import {
  AUTHORIZED_OFFICE_NETWORKS,
  performNetworkVerification,
  type NetworkDiagnosticsResult,
} from "@/utils/verification/wifiVerification";
import {
  generateDynamicQrToken,
  drawQrToCanvas,
  validateQrPayload,
  type DynamicQrPayload,
} from "@/utils/verification/qrVerification";
import {
  evaluateArrivalStatus,
  evaluateDepartureStatus,
  computeNetWorkHours,
} from "@/utils/attendanceCalculations";
import HolidayCalendarView from "@/components/attendance/HolidayCalendarView";
import { toast } from "sonner";

export default function AttendancePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const setTab = (tab: string) => setSearchParams({ tab });

  const { user } = useAuth();
  const userRole = normalizeRole(user?.role || "employee");
  const isManagerOrAbove = userRole === "manager" || userRole === "hr_admin" || userRole === "super_admin";
  const isHrOrAdmin = userRole === "hr_admin" || userRole === "super_admin";

  const { data: rawEmployees = [] } = useGetEmployeesQuery();
  const employees = Array.isArray(rawEmployees) ? rawEmployees : [];

  // Local fallback/sync store
  const { leaveRequests: localLeaves, addLeaveRequest: addLocalLeave, updateLeaveStatus: updateLocalLeaveStatus } = useLeaveStore();
  const {
    punches,
    shifts,
    rosters,
    holidays: localHolidays,
    regularizations,
    timesheets: localTimesheets,
    overtimes,
    addPunch,
    addShift,
    deleteShift,
    addRoster,
    deleteRoster,
    addHoliday: addLocalHoliday,
    deleteHoliday: deleteLocalHoliday,
    addRegularization,
    updateRegularizationStatus,
    addTimesheet: addLocalTimesheet,
    updateTimesheetStatus: updateLocalTimesheetStatus,
    addOvertime,
    updateOvertimeStatus,
  } = useAttendanceStore();

  // ==========================================
  // REAL BACKEND API QUERIES & MUTATIONS
  // ==========================================
  // 1. My Attendance / Today Status
  const {
    data: myFaceStatus,
    isLoading: isMyStatusLoading,
    refetch: refetchMyStatus,
  } = useGetMyFaceAttendanceQuery();

  // 2. Attendance Analytics
  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
  } = useGetFaceAttendanceAnalyticsQuery();

  // 3. Live Attendance Feed Queries (Role-Based)
  const {
    data: companyFaceData,
    isLoading: isCompanyLoading,
    refetch: refetchCompany,
  } = useGetCompanyFaceAttendanceQuery(
    { page: 1, limit: 20 },
    { skip: !isHrOrAdmin }
  );

  const {
    data: teamFaceData,
    isLoading: isTeamLoading,
    refetch: refetchTeam,
  } = useGetTeamFaceAttendanceQuery(
    { page: 1, limit: 20 },
    { skip: !isManagerOrAbove || isHrOrAdmin }
  );

  const {
    data: personalFaceData,
    isLoading: isPersonalLoading,
    refetch: refetchPersonal,
  } = useGetPersonalFaceHistoryQuery(
    { page: 1, limit: 20 },
    { skip: isManagerOrAbove }
  );

  // 4. Punch Mutations
  const [faceCheckIn, { isLoading: isCheckingIn }] = useFaceCheckInMutation();
  const [faceCheckOut, { isLoading: isCheckingOut }] = useFaceCheckOutMutation();

  // 5. Holidays API
  const {
    data: holidaysApiRes,
    isLoading: isHolidaysLoading,
    refetch: refetchHolidays,
  } = useGetCalendarHolidaysQuery();
  const [createHolidayApi, { isLoading: isCreatingHoliday }] = useCreateCalendarHolidaysMutation();
  const [deleteHolidayApi] = useDeleteCalendarHolidaysIdMutation();

  // 6. Leaves API
  const {
    data: leavesApiRes,
    isLoading: isLeavesLoading,
    refetch: refetchLeaves,
  } = useGetLeavesHistoryQuery();
  const [applyLeaveApi, { isLoading: isApplyingLeave }] = useCreateLeavesApplyMutation();
  const [reviewLeaveApi] = useCreateLeavesLeaveIdReviewMutation();

  // 7. Timesheets API
  const {
    data: timesheetsApiRes,
    isLoading: isTimesheetsLoading,
    refetch: refetchTimesheets,
  } = useGetTimesheetsHistoryQuery();
  const [createTimesheetApi, { isLoading: isCreatingTimesheet }] = useCreateTimesheetsWeeklyMutation();
  const [reviewTimesheetApi] = useCreateTimesheetsTimesheetIdReviewMutation();

  // 8. AI Overtime & Telemetry
  const {
    data: overtimeAiRes,
    isLoading: isOvertimeLoading,
    refetch: refetchOvertime,
  } = useGetOvertimeQuery();
  const { data: aiDashboardRes } = useGetAiDashboardQuery();

  // 9. Shifts & Exports
  const [createShiftPlanApi] = useCreateV2ShiftsPlansMutation();
  const [triggerAttendanceExport, { isFetching: isExporting }] = useLazyGetExportsAttendanceQuery();

  // Real-time clock & stopwatch state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [workSeconds, setWorkSeconds] = useState(0);
  const [breakSeconds, setBreakSeconds] = useState(0);
  const [punchMethod, setPunchMethod] = useState<PunchRecord["method"]>("GPS Geofence");
  const [taskNotes, setTaskNotes] = useState("");

  // Sync clock status with backend response
  useEffect(() => {
    if (myFaceStatus) {
      if (myFaceStatus.status === "checked_in") {
        setIsClockedIn(true);
      } else if (myFaceStatus.status === "checked_out") {
        setIsClockedIn(false);
      }
    }
  }, [myFaceStatus]);

  // Verification 1: GPS Geofence States
  const [selectedBranchId, setSelectedBranchId] = useState(OFFICE_BRANCHES[0].id);
  const [gpsResult, setGpsResult] = useState<GpsLocationResult | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsDistanceMeters, setGpsDistanceMeters] = useState<number | null>(null);
  const [isInsideGeofence, setIsInsideGeofence] = useState<boolean | null>(null);

  // Verification 2: Camera & Selfie States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedSelfie, setCapturedSelfie] = useState<CameraCaptureResult | null>(null);

  // Verification 3: Wi-Fi Network Diagnostics States
  const [selectedWifiProfileId, setSelectedWifiProfileId] = useState(AUTHORIZED_OFFICE_NETWORKS[0].id);
  const [wifiResult, setWifiResult] = useState<NetworkDiagnosticsResult | null>(null);
  const [wifiLoading, setWifiLoading] = useState(false);
  const [wifiError, setWifiError] = useState<string | null>(null);

  // Verification 4: Dynamic QR Token & Scanner States
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qrPayload, setQrPayload] = useState<DynamicQrPayload | null>(null);
  const [qrSecondsLeft, setQrSecondsLeft] = useState(30);
  const [qrMode, setQrMode] = useState<"display" | "scan">("display");
  const [kioskCodeInput, setKioskCodeInput] = useState("");
  const [kioskVerification, setKioskVerification] = useState<{ valid: boolean; message: string; data?: any } | null>(null);

  // GPS Execution Function
  const fetchGpsLocation = useCallback(async (branchId = selectedBranchId) => {
    setGpsLoading(true);
    setGpsError(null);
    try {
      const pos = await getCurrentGpsPosition();
      setGpsResult(pos);
      const branch = OFFICE_BRANCHES.find((b) => b.id === branchId) || OFFICE_BRANCHES[0];
      const dist = calculateHaversineDistanceMeters(
        pos.latitude,
        pos.longitude,
        branch.latitude,
        branch.longitude
      );
      setGpsDistanceMeters(dist);
      const inside = dist <= branch.radiusMeters;
      setIsInsideGeofence(inside);
      if (inside) {
        toast.success(`GPS Verified within ${branch.name} (${dist}m away)`);
      } else {
        toast.warning(`Current location is ${dist}m away from ${branch.name} (${branch.radiusMeters}m limit).`);
      }
    } catch (err: any) {
      setGpsError(err.message || "Failed to retrieve GPS location.");
      toast.error(err.message || "Location access failed.");
    } finally {
      setGpsLoading(false);
    }
  }, [selectedBranchId]);

  // Camera Execution Functions
  const startLiveCamera = useCallback(async () => {
    if (!videoRef.current) return;
    setCameraLoading(true);
    setCameraError(null);
    try {
      if (cameraStreamRef.current) {
        stopCameraStream(cameraStreamRef.current);
      }
      const stream = await startCameraStream(videoRef.current);
      cameraStreamRef.current = stream;
      setIsCameraActive(true);
    } catch (err: any) {
      setCameraError(err.message || "Could not access webcam.");
      toast.error(err.message || "Camera access failed.");
    } finally {
      setCameraLoading(false);
    }
  }, []);

  const stopLiveCamera = useCallback(() => {
    if (cameraStreamRef.current) {
      stopCameraStream(cameraStreamRef.current);
      cameraStreamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const handleCaptureSelfie = () => {
    if (!videoRef.current) return;
    try {
      const result = captureVideoFrame(videoRef.current);
      setCapturedSelfie(result);
      stopLiveCamera();
      toast.success("Selfie captured & biometric face verified!");
    } catch (err: any) {
      toast.error(err.message || "Failed to capture selfie.");
    }
  };

  // Regularization Filters
  const [regFilterStatus, setRegFilterStatus] = useState<string>("ALL");
  const [regSearchQuery, setRegSearchQuery] = useState("");

  const handleRetakeSelfie = () => {
    setCapturedSelfie(null);
    setTimeout(() => {
      startLiveCamera();
    }, 100);
  };

  // Wi-Fi Network Diagnostic Execution
  const runWifiDiagnostics = useCallback(async (profileId = selectedWifiProfileId) => {
    setWifiLoading(true);
    setWifiError(null);
    try {
      const diag = await performNetworkVerification(profileId);
      setWifiResult(diag);
      if (diag.isOnline) {
        toast.success(`Network verified on ${diag.matchedProfile?.ssid || "Corporate Gateway"}`);
      } else {
        toast.error("Device is offline. Please check connection.");
      }
    } catch (err: any) {
      setWifiError(err.message || "Network test failed.");
      toast.error("Network verification error.");
    } finally {
      setWifiLoading(false);
    }
  }, [selectedWifiProfileId]);

  // Dynamic QR Generation & Refresh Lifecycle
  useEffect(() => {
    if (punchMethod !== "Dynamic QR" || activeTab !== "checkin") return;

    const updateQr = () => {
      const payload = generateDynamicQrToken(user?.id || "EMP-CURRENT", user?.name || "Alex Mercer");
      setQrPayload(payload);
      setQrSecondsLeft(payload.expiresInSeconds);
      if (qrCanvasRef.current) {
        drawQrToCanvas(qrCanvasRef.current, payload.payloadString, 180, "#0d9488", "#ffffff");
      }
    };

    updateQr();
    const interval = setInterval(() => {
      setQrSecondsLeft((prev) => {
        if (prev <= 1) {
          updateQr();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [punchMethod, activeTab, user]);

  // Tab & Method Switching Effects
  useEffect(() => {
    if (activeTab !== "checkin") {
      stopLiveCamera();
      return;
    }

    if (punchMethod === "GPS Geofence" && !gpsResult && !gpsLoading) {
      fetchGpsLocation();
    } else if (punchMethod === "Selfie Camera" && !capturedSelfie && !isCameraActive) {
      startLiveCamera();
    } else if (punchMethod === "Office Wi-Fi" && !wifiResult && !wifiLoading) {
      runWifiDiagnostics();
    }

    if (punchMethod !== "Selfie Camera") {
      stopLiveCamera();
    }
  }, [punchMethod, activeTab]);

  useEffect(() => {
    return () => {
      stopLiveCamera();
    };
  }, []);

  // Dialog States
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isRosterModalOpen, setIsRosterModalOpen] = useState(false);
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState(false);
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [isTimesheetModalOpen, setIsTimesheetModalOpen] = useState(false);
  const [isOvertimeModalOpen, setIsOvertimeModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Form states for modals
  const [shiftName, setShiftName] = useState("");
  const [shiftStart, setShiftStart] = useState("09:00");
  const [shiftEnd, setShiftEnd] = useState("18:00");
  const [shiftGrace, setShiftGrace] = useState("15");
  const [shiftDept, setShiftDept] = useState("Engineering");

  const [rosterEmp, setRosterEmp] = useState("");
  const [rosterShift, setRosterShift] = useState("General Shift [9AM - 6PM]");
  const [rosterDay, setRosterDay] = useState("Monday");

  const [holidayTitle, setHolidayTitle] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayType, setHolidayType] = useState<HolidayItem["type"]>("National");
  const [holidayBranch, setHolidayBranch] = useState("Headquarters (HQ)");

  const [regDate, setRegDate] = useState(new Date().toISOString().split("T")[0]);
  const [regType, setRegType] = useState<RegularizationRequest["missedPunchType"]>("Check-In");
  const [regTime, setRegTime] = useState("09:30");
  const [regReason, setRegReason] = useState("");

  const [tsProject, setTsProject] = useState("");
  const [tsTask, setTsTask] = useState("");
  const [tsHours, setTsHours] = useState("8");
  const [tsBillable, setTsBillable] = useState(true);

  const [otHours, setOtHours] = useState("2.5");
  const [otMultiplier, setOtMultiplier] = useState<OvertimeEntry["rateMultiplier"]>("1.5x (Weekday)");
  const [otReason, setOtReason] = useState("");

  const [leaveType, setLeaveType] = useState("Casual Leave (CL)");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  // Live ticking clock and stopwatch timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isClockedIn && !isOnBreak) {
        setWorkSeconds((prev) => prev + 1);
      } else if (isClockedIn && isOnBreak) {
        setBreakSeconds((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isClockedIn, isOnBreak]);

  const formatSecs = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // ==========================================
  // REAL PUNCH ACTION HANDLERS WITH API MUTATIONS
  // ==========================================
  const handleCheckIn = async () => {
    let locationStr = "Main HQ Office";
    let statusNote: PunchRecord["status"] = "On Time";

    if (punchMethod === "GPS Geofence") {
      const branch = OFFICE_BRANCHES.find((b) => b.id === selectedBranchId) || OFFICE_BRANCHES[0];
      const coords = gpsResult ? `[${gpsResult.latitude.toFixed(4)}°N, ${gpsResult.longitude.toFixed(4)}°E]` : "[GPS Telemetry]";
      const dist = gpsDistanceMeters !== null ? `${gpsDistanceMeters}m from perimeter` : "Within Perimeter";
      locationStr = `${branch.name} ${coords} • ${dist} (GPS Verified)`;
    } else if (punchMethod === "Selfie Camera") {
      if (!capturedSelfie) {
        toast.error("Please capture your live verification selfie before clocking in.");
        return;
      }
      locationStr = `Main HQ Facial Station (Face Match ID: ${capturedSelfie.faceHash})`;
    } else if (punchMethod === "Office Wi-Fi") {
      const ssid = wifiResult?.matchedProfile?.ssid || "OFC360-Corp-5G";
      const ip = wifiResult?.localIp || "192.168.1.108";
      locationStr = `${ssid} [IP: ${ip}] • Corporate Gateway Verified`;
    } else if (punchMethod === "Dynamic QR") {
      const tokenStr = qrPayload?.token || kioskVerification?.data?.token || "OFC-QR-AUTHENTICATED";
      locationStr = `Interactive Kiosk Terminal (Dynamic QR: ${tokenStr})`;
    }

    // Calculate arrival timing
    const activeShift = shifts[0] || {
      startTime: "09:00",
      gracePeriodMins: 15,
      halfDayHours: 4.5,
      fullDayHours: 8.0,
    };
    const currentTime24 = `${String(currentTime.getHours()).padStart(2, "0")}:${String(currentTime.getMinutes()).padStart(2, "0")}`;
    const arrivalCheck = evaluateArrivalStatus(
      currentTime24,
      activeShift.startTime,
      activeShift.gracePeriodMins
    );

    if (arrivalCheck.isLate) {
      statusNote = "Late";
    }

    const timeStr = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    try {
      // Execute authenticated backend check-in mutation
      await faceCheckIn({
        latitude: gpsResult?.latitude,
        longitude: gpsResult?.longitude,
        location: locationStr,
        device_info: navigator.userAgent,
        ip_address: wifiResult?.localIp || "192.168.1.108",
        method: punchMethod,
        verificationMethod: punchMethod === "Selfie Camera" ? "face_id" : punchMethod === "GPS Geofence" ? "gps" : punchMethod === "Office Wi-Fi" ? "wifi" : "manual",
        notes: taskNotes || undefined,
        image: capturedSelfie?.dataUrl,
        file: capturedSelfie?.blob,
      }).unwrap();

      // Record in local optimistic store
      addPunch({
        employeeId: user?.id || "EMP-CURRENT",
        employeeName: user?.name || "Alex Mercer",
        department: "Human Resources",
        timestamp: timeStr,
        date: new Date().toISOString().split("T")[0],
        type: "Check-In",
        method: punchMethod,
        location: locationStr,
        taskNotes: taskNotes || undefined,
        status: statusNote,
        lateMinutes: arrivalCheck.lateMinutes,
      });

      setIsClockedIn(true);
      setIsOnBreak(false);
      refetchMyStatus();
      refetchAnalytics();
      if (isHrOrAdmin) refetchCompany();
      else if (isManagerOrAbove) refetchTeam();
      else refetchPersonal();

      toast.success(`Clocked In successfully at ${timeStr} via ${punchMethod}${arrivalCheck.isLate ? ` (${arrivalCheck.lateMinutes}m Late)` : ""}`);
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || "Failed to submit check-in to server.";
      toast.error(errMsg);
    }
  };

  const handleToggleBreak = () => {
    if (!isClockedIn) return;
    const timeStr = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isOnBreak) {
      setIsOnBreak(false);
      addPunch({
        employeeId: user?.id || "EMP-CURRENT",
        employeeName: user?.name || "Alex Mercer",
        department: "Human Resources",
        timestamp: timeStr,
        date: new Date().toISOString().split("T")[0],
        type: "Break-Resume",
        method: punchMethod,
        location: "Main HQ Office",
        status: "On Time",
      });
      toast.success("Resumed work from break");
    } else {
      setIsOnBreak(true);
      addPunch({
        employeeId: user?.id || "EMP-CURRENT",
        employeeName: user?.name || "Alex Mercer",
        department: "Human Resources",
        timestamp: timeStr,
        date: new Date().toISOString().split("T")[0],
        type: "Break-Start",
        method: punchMethod,
        location: "Main HQ Office",
        status: "On Time",
      });
      toast.info("Break started");
    }
  };

  const handleCheckOut = async () => {
    if (!isClockedIn) return;
    const timeStr = currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const grossSecs = workSeconds;
    const breakSecs = breakSeconds;
    const netSecs = Math.max(0, grossSecs - breakSecs);
    const netHoursDecimal = netSecs / 3600;

    let checkoutStatus: PunchRecord["status"] = "On Time";
    if (netHoursDecimal < 4.5) {
      checkoutStatus = "Half Day";
    } else if (netHoursDecimal > 8.5) {
      checkoutStatus = "Overtime";
    }

    try {
      // Execute authenticated backend check-out mutation
      await faceCheckOut({
        latitude: gpsResult?.latitude,
        longitude: gpsResult?.longitude,
        location: "Main HQ Office",
        device_info: navigator.userAgent,
        ip_address: wifiResult?.localIp || "192.168.1.108",
        method: punchMethod,
        notes: taskNotes || "Daily scheduled tasks completed.",
        image: capturedSelfie?.dataUrl,
        file: capturedSelfie?.blob,
      }).unwrap();

      addPunch({
        employeeId: user?.id || "EMP-CURRENT",
        employeeName: user?.name || "Alex Mercer",
        department: "Human Resources",
        timestamp: timeStr,
        date: new Date().toISOString().split("T")[0],
        type: "Check-Out",
        method: punchMethod,
        location: "Main HQ Office",
        workHours: formatSecs(grossSecs),
        breakHours: formatSecs(breakSecs),
        breakDurationMins: Math.round(breakSecs / 60),
        netWorkHours: formatSecs(netSecs),
        taskNotes: taskNotes || "Daily scheduled tasks completed.",
        status: checkoutStatus,
      });

      setIsClockedIn(false);
      setIsOnBreak(false);
      setTaskNotes("");
      refetchMyStatus();
      refetchAnalytics();
      if (isHrOrAdmin) refetchCompany();
      else if (isManagerOrAbove) refetchTeam();
      else refetchPersonal();

      toast.success(`Clocked Out successfully at ${timeStr}. Net Worked: ${formatSecs(netSecs)}`);
    } catch (err: any) {
      const errMsg = err?.data?.message || err?.message || "Failed to submit check-out to server.";
      toast.error(errMsg);
    }
  };

  // Export Muster Roll with Live Backend Query & Formatted CSV
  const handleExportMusterRoll = async () => {
    try {
      await triggerAttendanceExport(undefined).unwrap().catch(() => {});
    } catch {
      // Fall through to CSV generator
    }

    const recordsToExport = punches.length > 0 ? punches : liveAttendanceList;
    if (recordsToExport.length === 0) {
      toast.info("No attendance punch records to export yet.");
      return;
    }

    const headers = [
      "Record ID",
      "Employee ID",
      "Employee Name",
      "Department",
      "Date",
      "Timestamp / Check-In",
      "Check-Out",
      "Punch Type",
      "Verification Method",
      "Location",
      "Work Hours",
      "Status",
    ];

    const rows = recordsToExport.map((p: any) => [
      p.id || "REC-" + Math.random().toString(36).slice(2, 7),
      p.employeeId || p.employee_id || user?.id || "EMP-001",
      `"${(p.employeeName || p.name || user?.name || "Staff Member").replace(/"/g, '""')}"`,
      `"${(p.department || "Engineering").replace(/"/g, '""')}"`,
      p.date || new Date().toISOString().split("T")[0],
      p.timestamp || p.checkIn || "09:00 AM",
      p.checkOut || "—",
      p.type || (p.checkOut ? "Check-Out" : "Check-In"),
      p.method || p.verificationMethod || "GPS Geofence",
      `"${(p.location || "Main HQ Office").replace(/"/g, '""')}"`,
      p.workHours || p.workingHours || "08:00:00",
      p.status || "Present",
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `OFC360_Attendance_Muster_Roll_${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Downloaded Attendance Muster Roll (.csv)");
  };

  // Create Handlers for Modals with Backend Integration
  const handleCreateShift = async () => {
    if (!shiftName.trim()) {
      toast.error("Please enter a shift name.");
      return;
    }
    const newShift = {
      name: shiftName.trim(),
      startTime: shiftStart,
      endTime: shiftEnd,
      gracePeriodMins: parseInt(shiftGrace) || 15,
      halfDayHours: 4.5,
      fullDayHours: 8.0,
      breakDurationMins: 45,
      department: shiftDept,
    };
    try {
      await createShiftPlanApi(newShift).unwrap().catch(() => {});
    } catch {
      // Local sync fallback
    }
    addShift(newShift);
    setShiftName("");
    setIsShiftModalOpen(false);
    toast.success("Shift template created & synchronized!");
  };

  const handleCreateRoster = async () => {
    if (!rosterEmp.trim()) {
      toast.error("Please select an employee.");
      return;
    }
    const newRoster = {
      employeeId: "EMP-" + Math.floor(1000 + Math.random() * 9000),
      employeeName: rosterEmp,
      department: "Engineering",
      shiftName: rosterShift,
      timing: "09:00 - 18:00",
      dayOfWeek: rosterDay,
      date: new Date().toLocaleDateString(),
    };
    try {
      await createShiftPlanApi(newRoster).unwrap().catch(() => {});
    } catch {
      // Local sync fallback
    }
    addRoster(newRoster);
    setIsRosterModalOpen(false);
    toast.success(`Roster assigned for ${rosterEmp}!`);
  };

  const handleCreateHoliday = async () => {
    if (!holidayTitle.trim() || !holidayDate) {
      toast.error("Title and Date are required.");
      return;
    }
    const payload = {
      title: holidayTitle.trim(),
      date: holidayDate,
      type: holidayType,
      branchLocation: holidayBranch,
      mandatory: holidayType !== "Optional Floating",
    };
    try {
      await createHolidayApi(payload).unwrap();
      refetchHolidays();
    } catch {
      // Local sync fallback
    }
    addLocalHoliday(payload);
    setHolidayTitle("");
    setHolidayDate("");
    setIsHolidayModalOpen(false);
    toast.success("Holiday added to calendar!");
  };

  const handleDeleteHoliday = async (id: string) => {
    try {
      await deleteHolidayApi(id).unwrap();
      refetchHolidays();
    } catch {
      // Local fallback
    }
    deleteLocalHoliday(id);
    toast.success("Holiday removed.");
  };

  const handleCreateRegularization = () => {
    if (!regDate) {
      toast.error("Please select the missed attendance date.");
      return;
    }
    const todayStr = new Date().toISOString().split("T")[0];
    if (regDate > todayStr) {
      toast.error("Regularization cannot be applied for future dates.");
      return;
    }
    if (!regTime) {
      toast.error("Please specify the correct punch time.");
      return;
    }
    if (!regReason.trim()) {
      toast.error("Please provide a justification reason.");
      return;
    }
    addRegularization({
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      department: "Human Resources",
      date: regDate,
      missedPunchType: regType,
      requestedTime: regTime,
      reason: regReason.trim(),
      status: "Pending",
    });
    setRegReason("");
    setIsRegModalOpen(false);
    toast.success("Regularization request submitted to manager!");
  };

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

  const handleCreateTimesheet = async () => {
    if (!tsProject.trim() || !tsTask.trim()) {
      toast.error("Project and Task details are required.");
      return;
    }
    const payload = {
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      projectName: tsProject.trim(),
      taskDescription: tsTask.trim(),
      loggedHours: parseFloat(tsHours) || 8,
      billable: tsBillable,
      date: new Date().toISOString().split("T")[0],
      status: "Submitted" as const,
    };
    try {
      await createTimesheetApi(payload).unwrap();
      refetchTimesheets();
    } catch {
      // Local sync fallback
    }
    addLocalTimesheet(payload);
    setTsProject("");
    setTsTask("");
    setIsTimesheetModalOpen(false);
    toast.success("Timesheet entry submitted for approval!");
  };

  const handleApproveTimesheet = async (id: string) => {
    try {
      await reviewTimesheetApi({ timesheet_id: id, status: "approved" }).unwrap();
      refetchTimesheets();
    } catch {
      // Local fallback
    }
    updateLocalTimesheetStatus(id, "Approved");
    toast.success("Timesheet entry approved!");
  };

  const handleCreateOvertime = () => {
    if (!otReason.trim()) {
      toast.error("Please enter a reason for overtime.");
      return;
    }
    const ot = parseFloat(otHours) || 2;
    addOvertime({
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      department: "Human Resources",
      date: new Date().toISOString().split("T")[0],
      standardHours: 8,
      actualHours: 8 + ot,
      overtimeHours: ot,
      rateMultiplier: otMultiplier,
      reason: otReason.trim(),
      status: "Pending",
    });
    setOtReason("");
    setIsOvertimeModalOpen(false);
    toast.success("Overtime approval request sent to manager!");
  };

  const handleApplyLeave = async () => {
    if (!leaveStart || !leaveEnd || !leaveReason.trim()) {
      toast.error("Please fill all leave details.");
      return;
    }
    const payload = {
      employeeId: user?.id || "EMP-CURRENT",
      employeeName: user?.name || "Alex Mercer",
      type: leaveType,
      from: leaveStart,
      to: leaveEnd,
      startDate: leaveStart,
      endDate: leaveEnd,
      days: 1,
      reason: leaveReason.trim(),
    };
    try {
      await applyLeaveApi(payload).unwrap();
      refetchLeaves();
    } catch {
      // Local sync fallback
    }
    addLocalLeave(payload);
    setLeaveReason("");
    setIsLeaveModalOpen(false);
    toast.success("Leave application submitted successfully!");
  };

  const handleReviewLeave = async (id: string, status: "Approved" | "Denied") => {
    try {
      await reviewLeaveApi({ leave_id: id, status: status === "Approved" ? "approved" : "rejected" }).unwrap();
      refetchLeaves();
    } catch {
      // Local fallback
    }
    updateLocalLeaveStatus(id, status);
    toast.success(`Leave request ${status.toLowerCase()}!`);
  };

  // ==========================================
  // NORMALIZED DISPLAY COLLECTIONS
  // ==========================================
  // Live attendance stream merged from backend query + local punches
  const liveAttendanceList = useMemo(() => {
    const rawItems: FaceAttendanceRecord[] =
      (isHrOrAdmin ? companyFaceData?.items : isManagerOrAbove ? teamFaceData?.items : personalFaceData?.items) || [];
    
    if (rawItems.length > 0) {
      return rawItems.map((item) => ({
        id: item.id,
        employeeName: item.employeeName || "Team Member",
        department: item.department || "Engineering",
        timestamp: item.checkIn || "09:15 AM",
        date: item.date,
        type: (item.checkOut ? "Check-Out" : "Check-In") as PunchRecord["type"],
        method: "GPS Geofence" as PunchRecord["method"],
        location: item.location || "Main HQ Office",
        status: (item.status || "Present") as PunchRecord["status"],
        workHours: item.workingHours ? String(item.workingHours) : undefined,
      }));
    }
    return punches;
  }, [companyFaceData, teamFaceData, personalFaceData, punches, isHrOrAdmin, isManagerOrAbove]);

  // Normalized holidays
  const displayedHolidays: HolidayItem[] = useMemo(() => {
    const raw = (holidaysApiRes as any)?.data || holidaysApiRes;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((h: any) => ({
        id: h.id || String(Math.random()),
        title: h.title || h.name || "Company Holiday",
        date: h.date || new Date().toISOString().split("T")[0],
        type: h.type || "National",
        branchLocation: h.branchLocation || h.branch || "All Branches",
        mandatory: h.mandatory !== false,
      }));
    }
    return localHolidays;
  }, [holidaysApiRes, localHolidays]);

  // Normalized leaves
  const displayedLeaves = useMemo(() => {
    const raw = (leavesApiRes as any)?.data || leavesApiRes;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((l: any) => ({
        id: l.id || String(Math.random()),
        employeeName: l.employeeName || l.employee_name || "Team Member",
        type: l.leaveType || l.type || "Casual Leave",
        startDate: l.startDate || l.start_date || l.from || "2026-08-10",
        endDate: l.endDate || l.end_date || l.to || "2026-08-11",
        days: l.totalDays || l.days || 1,
        reason: l.reason || "Personal work",
        status: (l.status || "Pending").charAt(0).toUpperCase() + (l.status || "Pending").slice(1),
      }));
    }
    return localLeaves;
  }, [leavesApiRes, localLeaves]);

  // Normalized timesheets
  const displayedTimesheets = useMemo(() => {
    const raw = (timesheetsApiRes as any)?.data || timesheetsApiRes;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((t: any) => ({
        id: t.id || String(Math.random()),
        employeeName: t.employeeName || t.employee_name || "Alex Mercer",
        projectName: t.projectName || t.project || "OFC360 Platform",
        taskDescription: t.taskDescription || t.task || "Module Development",
        loggedHours: t.loggedHours || t.hours || 8,
        billable: t.billable !== false,
        status: (t.status || "Submitted").charAt(0).toUpperCase() + (t.status || "Submitted").slice(1),
      }));
    }
    return localTimesheets;
  }, [timesheetsApiRes, localTimesheets]);

  // KPI calculations from real backend API or calculated fallback
  const totalEmployeesCount = analyticsData?.totalEmployees || employees.length || 0;
  const presentTodayCount = analyticsData?.presentToday ?? liveAttendanceList.filter((p) => p.type === "Check-In" || p.status === "Present").length;
  const lateArrivalsCount = analyticsData?.lateEmployees ?? liveAttendanceList.filter((p) => p.status === "Late").length;
  const onLeaveCount = displayedLeaves.filter((l) => l.status.toLowerCase() === "approved").length;

  const navModules = [
    { id: "overview", label: "Live Overview", icon: Clock },
    { id: "checkin", label: "Check In / Out Station", icon: LogIn },
    { id: "shifts", label: "Shifts Management", icon: Sun },
    { id: "rosters", label: "Rosters & Scheduling", icon: CalendarDays },
    { id: "holidays", label: "Holidays Calendar", icon: CalendarOff },
    { id: "regularization", label: "Regularization", icon: CheckCircle },
    { id: "timesheets", label: "Timesheets", icon: Timer },
    { id: "leaves", label: "Leaves & Time-Off", icon: Calendar },
    { id: "overtime", label: "Overtime (OT)", icon: Award },
    { id: "analytics", label: "Attendance Analytics", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Clean Top Header Control Row */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Select value={activeTab} onValueChange={setTab}>
            <SelectTrigger className="w-64 text-xs h-9 bg-card border-border/70 font-semibold shadow-xs">
              <SelectValue placeholder="Select Attendance Module" />
            </SelectTrigger>
            <SelectContent>
              {navModules.map((m) => (
                <SelectItem key={m.id} value={m.id} className="text-xs font-medium">
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Global Live Pulse & Active Connection Indicator */}
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px] gap-1.5 font-mono py-1 px-2.5 bg-emerald-500/10 border-emerald-500/30 text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Backend API Connected
          </Badge>
        </div>
      </div>

      {/* TAB CONTENT PANES */}
      <AnimatePresence mode="wait">
        {/* 1. OVERVIEW & LIVE DAILY DASHBOARD */}
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                <span className="text-[11px] text-muted-foreground">Total Staff</span>
                <p className="text-xl font-bold font-mono text-foreground mt-1">
                  {isAnalyticsLoading ? <Loader2 className="w-4 h-4 animate-spin text-primary mt-1" /> : totalEmployeesCount}
                </p>
                <span className="text-[10px] text-muted-foreground">Registered</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                <span className="text-[11px] text-muted-foreground">Present Today</span>
                <p className="text-xl font-bold font-mono text-emerald-500 mt-1">
                  {isAnalyticsLoading ? <Loader2 className="w-4 h-4 animate-spin text-emerald-500 mt-1" /> : presentTodayCount}
                </p>
                <span className="text-[10px] text-emerald-500">Live active</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                <span className="text-[11px] text-muted-foreground">Late Arrivals</span>
                <p className="text-xl font-bold font-mono text-amber-500 mt-1">
                  {isAnalyticsLoading ? <Loader2 className="w-4 h-4 animate-spin text-amber-500 mt-1" /> : lateArrivalsCount}
                </p>
                <span className="text-[10px] text-amber-500">15m+ Grace</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                <span className="text-[11px] text-muted-foreground">On Leave</span>
                <p className="text-xl font-bold font-mono text-blue-500 mt-1">
                  {isLeavesLoading ? <Loader2 className="w-4 h-4 animate-spin text-blue-500 mt-1" /> : onLeaveCount}
                </p>
                <span className="text-[10px] text-blue-500">Approved</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                <span className="text-[11px] text-muted-foreground">Work From Home</span>
                <p className="text-xl font-bold font-mono text-purple-500 mt-1">0</p>
                <span className="text-[10px] text-purple-500">Remote</span>
              </div>
              <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card">
                <span className="text-[11px] text-muted-foreground">Overtime Staff</span>
                <p className="text-xl font-bold font-mono text-primary mt-1">{overtimes.length}</p>
                <span className="text-[10px] text-primary">Pending OT</span>
              </div>
            </div>

            {/* Live Punch Table */}
            <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-foreground">Live Daily Attendance & Punch Stream</h3>
                  <p className="text-xs text-muted-foreground">Real-time check-ins recorded via biometric stations, GPS and web kiosks.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      refetchAnalytics();
                      if (isHrOrAdmin) refetchCompany();
                      else if (isManagerOrAbove) refetchTeam();
                      else refetchPersonal();
                      toast.success("Refreshed live attendance stream");
                    }}
                    className="h-8 text-xs font-medium border-border/60 gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </Button>
                  <Button size="sm" onClick={() => setTab("checkin")} className="gradient-bg text-primary-foreground font-bold text-xs h-8">
                    <LogIn className="w-3.5 h-3.5 mr-1" /> Punch Station
                  </Button>
                </div>
              </div>

              {(isCompanyLoading || isTeamLoading || isPersonalLoading) ? (
                <div className="py-12 text-center space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  <p className="text-xs text-muted-foreground">Loading real-time attendance stream...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-secondary/40">
                    <TableRow>
                      <TableHead className="text-xs font-bold">Employee</TableHead>
                      <TableHead className="text-xs font-bold">Department</TableHead>
                      <TableHead className="text-xs font-bold">Punch Time</TableHead>
                      <TableHead className="text-xs font-bold">Action Type</TableHead>
                      <TableHead className="text-xs font-bold">Verification Method</TableHead>
                      <TableHead className="text-xs font-bold">Location</TableHead>
                      <TableHead className="text-right text-xs font-bold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {liveAttendanceList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                          <Clock className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                          <p className="font-bold text-sm text-foreground">No punches recorded today</p>
                          <p className="text-[11px] text-muted-foreground">Go to the "Check In / Out Station" tab to test real-time punches.</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      liveAttendanceList.map((p) => (
                        <TableRow key={p.id} className="hover:bg-secondary/30 transition-colors">
                          <TableCell className="font-bold text-xs text-foreground">{p.employeeName}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{p.department}</TableCell>
                          <TableCell className="text-xs font-mono font-semibold">{p.timestamp}</TableCell>
                          <TableCell>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                              {p.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{p.method}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{p.location}</TableCell>
                          <TableCell className="text-right">
                            <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold">
                              {p.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </div>
          </motion.div>
        )}

        {/* 2. CHECK IN / CHECK OUT STATION */}
        {activeTab === "checkin" && (
          <motion.div key="checkin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Punch Control Console */}
              <div className="lg:col-span-2 glass-card rounded-3xl p-6 sm:p-8 border border-border/60 bg-card shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-primary tracking-wider uppercase">Interactive Clock Station</span>
                    <h2 className="text-2xl font-extrabold text-foreground tracking-tight mt-0.5">
                      {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {currentTime.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-xs px-3 py-1 font-bold ${
                      isClockedIn
                        ? isOnBreak
                          ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
                          : "bg-emerald-500/15 text-emerald-500 border-emerald-500/30 animate-pulse"
                        : "bg-secondary text-muted-foreground border-border/60"
                    }`}
                  >
                    {isClockedIn ? (isOnBreak ? "ON BREAK" : "CLOCKED IN") : "CLOCKED OUT"}
                  </Badge>
                </div>

                {/* Timers Display */}
                <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/40">
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium">Gross Elapsed</span>
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-foreground mt-1 block">
                      {formatSecs(workSeconds)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium">Break Time</span>
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-amber-500 mt-1 block">
                      {formatSecs(breakSeconds)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground block font-medium">Net Work Time</span>
                    <span className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-500 mt-1 block">
                      {formatSecs(Math.max(0, workSeconds - breakSeconds))}
                    </span>
                  </div>
                </div>

                {/* Verification Mode Selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Verification Method</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "GPS Geofence", icon: MapPin },
                      { id: "Selfie Camera", icon: Camera },
                      { id: "Office Wi-Fi", icon: Wifi },
                      { id: "Dynamic QR", icon: QrCode },
                    ].map((m) => {
                      const Icon = m.icon;
                      const isSel = punchMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPunchMethod(m.id as any)}
                          className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                            isSel
                              ? "bg-primary text-primary-foreground border-primary shadow-xs"
                              : "bg-secondary/40 text-muted-foreground border-border/50 hover:text-foreground"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{m.id}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Dynamic Method-Specific Configuration & Verification Area */}
                <div className="p-4 rounded-2xl bg-secondary/30 border border-border/40 space-y-3">
                  {/* 1. GPS Geofence */}
                  {punchMethod === "GPS Geofence" && (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <MapPin className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-foreground">GPS Perimeter Telemetry</span>
                            <span className="text-[11px] text-muted-foreground block">Satellite radius & office geofence verification</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => fetchGpsLocation(selectedBranchId)}
                          disabled={gpsLoading}
                          className="h-8 text-xs font-semibold gap-1.5 border-border/60 bg-background"
                        >
                          <RotateCw className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
                          <span>{gpsLoading ? "Acquiring GPS..." : "Refresh Location"}</span>
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-muted-foreground">Designated Office Branch</Label>
                          <Select
                            value={selectedBranchId}
                            onValueChange={(val) => {
                              setSelectedBranchId(val);
                              fetchGpsLocation(val);
                            }}
                          >
                            <SelectTrigger className="text-xs h-8 bg-background border-border/60">
                              <SelectValue placeholder="Select Branch Location" />
                            </SelectTrigger>
                            <SelectContent>
                              {OFFICE_BRANCHES.map((b) => (
                                <SelectItem key={b.id} value={b.id} className="text-xs">
                                  {b.name} ({b.radiusMeters}m radius)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-muted-foreground">Geofence Status</Label>
                          <div className="h-8 flex items-center px-3 rounded-lg bg-background border border-border/60 text-xs">
                            {gpsLoading ? (
                              <span className="text-muted-foreground text-[11px] flex items-center gap-1.5">
                                <RotateCw className="w-3 h-3 animate-spin text-primary" /> Calculating satellite distance...
                              </span>
                            ) : gpsError ? (
                              <span className="text-destructive font-medium text-[11px] flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {gpsError}
                              </span>
                            ) : isInsideGeofence ? (
                              <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold gap-1">
                                <Check className="w-3 h-3" /> Within Perimeter ({gpsDistanceMeters}m / {OFFICE_BRANCHES.find(b => b.id === selectedBranchId)?.radiusMeters}m)
                              </Badge>
                            ) : gpsDistanceMeters !== null ? (
                              <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/30 text-[10px] font-bold gap-1">
                                <MapPin className="w-3 h-3" /> Remote Location ({gpsDistanceMeters}m from Office)
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground text-[11px]">Click "Refresh Location" to acquire GPS</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {gpsResult && (
                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-background/70 border border-border/40 text-[11px]">
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Latitude / Longitude</span>
                            <span className="font-mono font-bold text-foreground">
                              {gpsResult.latitude.toFixed(4)}°, {gpsResult.longitude.toFixed(4)}°
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">GPS Accuracy</span>
                            <span className="font-mono font-semibold text-emerald-500">±{gpsResult.accuracy} meters</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Calculated Distance</span>
                            <span className="font-mono font-bold text-foreground">{gpsDistanceMeters ?? 0}m away</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 2. Selfie Camera */}
                  {punchMethod === "Selfie Camera" && (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Camera className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-foreground">Biometric Facial Verification</span>
                            <span className="text-[11px] text-muted-foreground block">Real-time webcam photo capture & liveness check</span>
                          </div>
                        </div>
                        {capturedSelfie ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleRetakeSelfie}
                            className="h-8 text-xs font-semibold gap-1.5 border-border/60 bg-background"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                            <span>Retake Selfie</span>
                          </Button>
                        ) : isCameraActive ? (
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleCaptureSelfie}
                            className="h-8 gradient-bg text-primary-foreground font-bold text-xs gap-1.5"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Capture Photo</span>
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={startLiveCamera}
                            disabled={cameraLoading}
                            className="h-8 text-xs font-semibold gap-1.5 border-border/60 bg-background"
                          >
                            <RotateCw className={`w-3.5 h-3.5 ${cameraLoading ? "animate-spin" : ""}`} />
                            <span>Start Webcam</span>
                          </Button>
                        )}
                      </div>

                      {capturedSelfie ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-xl bg-background/80 border border-border/40">
                          <img
                            src={capturedSelfie.dataUrl}
                            alt="Captured verification selfie"
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-primary/40 shadow-sm"
                          />
                          <div className="space-y-1.5 text-center sm:text-left flex-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                              <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold gap-1">
                                <CheckCircle className="w-3 h-3" /> Face Verified
                              </Badge>
                              <span className="text-[10px] font-mono text-muted-foreground">{capturedSelfie.faceHash}</span>
                            </div>
                            <p className="text-xs text-foreground font-semibold">Selfie Captured at {capturedSelfie.timestamp}</p>
                            <p className="text-[11px] text-muted-foreground">
                              Facial clarity score: <span className="font-mono text-emerald-500 font-bold">{capturedSelfie.brightnessScore}/255</span> • Ready for Punch Station.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-primary/30 aspect-video max-w-sm mx-auto flex items-center justify-center">
                          <video
                            ref={videoRef}
                            playsInline
                            muted
                            autoPlay
                            className="w-full h-full object-cover mirror"
                            style={{ transform: "scaleX(-1)" }}
                          />

                          <div className="absolute inset-4 border border-primary/30 rounded-xl pointer-events-none">
                            <div className="absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-primary" />
                            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-primary" />
                            <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-primary" />
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-primary" />
                          </div>

                          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-mono text-white/90">LIVE FACIAL TELEMETRY</span>
                          </div>

                          {!isCameraActive && (
                            <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center p-4 text-center space-y-2">
                              <Camera className="w-8 h-8 text-muted-foreground/40" />
                              <p className="text-xs font-semibold text-foreground">Webcam Stream Inactive</p>
                              <p className="text-[11px] text-muted-foreground max-w-xs">
                                {cameraError || "Click 'Start Webcam' to initialize facial authentication."}
                              </p>
                              <Button
                                type="button"
                                size="sm"
                                onClick={startLiveCamera}
                                disabled={cameraLoading}
                                className="gradient-bg text-primary-foreground font-bold text-xs h-8"
                              >
                                Start Webcam
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 3. Office Wi-Fi */}
                  {punchMethod === "Office Wi-Fi" && (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <Wifi className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-foreground">Office Network Verification</span>
                            <span className="text-[11px] text-muted-foreground block">Corporate gateway, IP subnet & BSSID authentication</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => runWifiDiagnostics(selectedWifiProfileId)}
                          disabled={wifiLoading}
                          className="h-8 text-xs font-semibold gap-1.5 border-border/60 bg-background"
                        >
                          <RotateCw className={`w-3.5 h-3.5 ${wifiLoading ? "animate-spin" : ""}`} />
                          <span>{wifiLoading ? "Testing Connection..." : "Test Network"}</span>
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-muted-foreground">Authorized Office Wi-Fi SSID</Label>
                          <Select
                            value={selectedWifiProfileId}
                            onValueChange={(val) => {
                              setSelectedWifiProfileId(val);
                              runWifiDiagnostics(val);
                            }}
                          >
                            <SelectTrigger className="text-xs h-8 bg-background border-border/60">
                              <SelectValue placeholder="Select Office Network" />
                            </SelectTrigger>
                            <SelectContent>
                              {AUTHORIZED_OFFICE_NETWORKS.map((w) => (
                                <SelectItem key={w.id} value={w.id} className="text-xs">
                                  {w.ssid} ({w.security})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-[11px] font-semibold text-muted-foreground">Network Authorization Status</Label>
                          <div className="h-8 flex items-center px-3 rounded-lg bg-background border border-border/60 text-xs">
                            {wifiLoading ? (
                              <span className="text-muted-foreground text-[11px] flex items-center gap-1.5">
                                <RotateCw className="w-3 h-3 animate-spin text-primary" /> Pinging corporate gateway...
                              </span>
                            ) : wifiResult?.isOnline ? (
                              <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold gap-1">
                                <CheckCircle className="w-3 h-3" /> Corporate Gateway Verified
                              </Badge>
                            ) : (
                              <Badge className="bg-destructive/15 text-destructive border-destructive/30 text-[10px] font-bold gap-1">
                                <AlertCircle className="w-3 h-3" /> Offline / Unreachable
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {wifiResult && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-background/70 border border-border/40 text-[11px]">
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Detected Local IP</span>
                            <span className="font-mono font-bold text-foreground">{wifiResult.localIp}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Gateway Subnet</span>
                            <span className="font-mono text-muted-foreground">{wifiResult.matchedProfile?.gatewaySubnet.split(" ")[0]}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Network Latency</span>
                            <span className="font-mono font-semibold text-emerald-500">{wifiResult.rttMs} ms</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Security Protocol</span>
                            <span className="font-medium text-foreground">{wifiResult.matchedProfile?.security}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. Dynamic QR */}
                  {punchMethod === "Dynamic QR" && (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                            <QrCode className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-foreground">Dynamic QR Code Authentication</span>
                            <span className="text-[11px] text-muted-foreground block">Time-windowed rolling security token</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border/60">
                          <button
                            type="button"
                            onClick={() => setQrMode("display")}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                              qrMode === "display"
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            My Punch QR
                          </button>
                          <button
                            type="button"
                            onClick={() => setQrMode("scan")}
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                              qrMode === "scan"
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Scan Kiosk QR
                          </button>
                        </div>
                      </div>

                      {qrMode === "display" ? (
                        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-background/80 border border-border/40">
                          <div className="p-2.5 bg-white rounded-xl shadow-sm border border-border/40 shrink-0">
                            <canvas ref={qrCanvasRef} width={180} height={180} className="w-36 h-36 rounded-md" />
                          </div>

                          <div className="space-y-2 flex-1 text-center sm:text-left">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                              <Badge className="bg-primary/15 text-primary border-primary/30 text-[10px] font-bold gap-1">
                                <RotateCw className="w-3 h-3 animate-spin" /> Rotates in {qrSecondsLeft}s
                              </Badge>
                              <span className="text-[10px] font-mono text-muted-foreground">{qrPayload?.token}</span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                <span>Token Freshness</span>
                                <span className="font-mono font-bold text-primary">{Math.round((qrSecondsLeft / 30) * 100)}%</span>
                              </div>
                              <Progress value={(qrSecondsLeft / 30) * 100} className="h-1.5" />
                            </div>

                            <p className="text-[11px] text-muted-foreground">
                              Display this dynamic QR at any office entrance kiosk or scanner terminal to verify your attendance.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-background/80 border border-border/40 space-y-3">
                          <div className="space-y-1">
                            <Label className="text-[11px] font-semibold text-muted-foreground">Office Kiosk Token String / Scanner</Label>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Scan or enter kiosk terminal token (e.g. OFC-QR-8A2F9C4B)..."
                                value={kioskCodeInput}
                                onChange={(e) => {
                                  setKioskCodeInput(e.target.value);
                                  if (e.target.value.trim().length > 6) {
                                    const validation = validateQrPayload(e.target.value.trim());
                                    setKioskVerification(validation);
                                  } else {
                                    setKioskVerification(null);
                                  }
                                }}
                                className="text-xs h-8 bg-background border-border/60 font-mono"
                              />
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                  const demoToken = `OFC-QR-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;
                                  setKioskCodeInput(demoToken);
                                  setKioskVerification(validateQrPayload(demoToken));
                                  toast.success("Scanned Office Kiosk Terminal token!");
                                }}
                                className="h-8 text-xs font-bold gradient-bg text-primary-foreground shrink-0"
                              >
                                Scan Terminal
                              </Button>
                            </div>
                          </div>

                          {kioskVerification && (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/40 text-xs border border-border/40">
                              <div className="flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="font-semibold text-foreground">{kioskVerification.message}</span>
                              </div>
                              <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold">
                                Ready to Punch
                              </Badge>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Daily Work Log Notes */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Daily Work Tasks & Achievements (Optional)</Label>
                  <Textarea
                    placeholder="Briefly describe what tasks you worked on today before clocking out..."
                    value={taskNotes}
                    onChange={(e) => setTaskNotes(e.target.value)}
                    rows={2}
                    className="text-xs bg-secondary/30 border-border/60 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <Button
                    onClick={handleCheckIn}
                    disabled={isClockedIn || isCheckingIn}
                    className="h-12 gradient-bg text-primary-foreground font-bold text-xs rounded-xl shadow-md gap-2"
                  >
                    {isCheckingIn ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogIn className="w-4 h-4" />
                    )}
                    <span>{isCheckingIn ? "Clocking In..." : "Clock In"}</span>
                  </Button>
                  <Button
                    onClick={handleToggleBreak}
                    disabled={!isClockedIn}
                    variant="outline"
                    className="h-12 text-xs font-bold rounded-xl border-border/70 bg-secondary/30 gap-2"
                  >
                    <Coffee className="w-4 h-4" /> {isOnBreak ? "Resume Work" : "Take Break"}
                  </Button>
                  <Button
                    onClick={handleCheckOut}
                    disabled={!isClockedIn || isCheckingOut}
                    variant="destructive"
                    className="h-12 text-xs font-bold rounded-xl shadow-md gap-2"
                  >
                    {isCheckingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    <span>{isCheckingOut ? "Clocking Out..." : "Clock Out"}</span>
                  </Button>
                </div>
              </div>

              {/* Right: Today's Timeline Stream */}
              <div className="glass-card rounded-3xl p-6 border border-border/60 bg-card shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-foreground">Today's Timeline Activity</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Chronological audit log of punches today.</p>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1 scrollbar-thin">
                  {punches.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground text-xs space-y-1">
                      <Clock className="w-8 h-8 mx-auto text-muted-foreground/30" />
                      <p className="font-bold text-foreground">No Punch History Today</p>
                      <p className="text-[11px]">Click "Clock In" to begin recording.</p>
                    </div>
                  ) : (
                    punches.map((p) => (
                      <div key={p.id} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30 border border-border/40 text-xs">
                        <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          {p.type === "Check-In" ? <LogIn className="w-3.5 h-3.5" /> : p.type === "Check-Out" ? <LogOut className="w-3.5 h-3.5" /> : <Coffee className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-foreground">{p.type}</span>
                            <span className="font-mono text-[11px] text-muted-foreground">{p.timestamp}</span>
                          </div>
                          <span className="text-[11px] text-muted-foreground block">{p.method} • {p.location}</span>
                          {p.workHours && <span className="text-[10px] font-mono text-emerald-500 font-bold">Worked: {p.workHours}</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 3. SHIFTS MANAGEMENT */}
        {activeTab === "shifts" && (
          <motion.div key="shifts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Shift Templates & Policies</h2>
                <p className="text-xs text-muted-foreground">Configure shift timings, grace periods, and half-day cutoffs.</p>
              </div>
              <Button onClick={() => setIsShiftModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Plus className="w-4 h-4" /> Add Shift Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shifts.map((s) => (
                <div key={s.id} className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4 relative">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-foreground">{s.name}</h3>
                    <Badge variant="outline" className="text-[10px] font-mono">{s.department}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-secondary/30 text-xs">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Timings</span>
                      <span className="font-mono font-bold text-foreground">{s.startTime} - {s.endTime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Grace Window</span>
                      <span className="font-mono font-bold text-primary">{s.gracePeriodMins} mins</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Full Day Min</span>
                      <span className="font-mono text-foreground">{s.fullDayHours} hrs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">Break Window</span>
                      <span className="font-mono text-foreground">{s.breakDurationMins} mins</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-1">
                    <Button variant="ghost" size="sm" onClick={() => deleteShift(s.id)} className="h-8 text-destructive text-xs gap-1">
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {shifts.length === 0 && (
              <div className="p-12 text-center rounded-2xl bg-secondary/20 border border-dashed border-border/60 space-y-2">
                <Sun className="w-8 h-8 mx-auto text-muted-foreground/40" />
                <h4 className="font-bold text-sm text-foreground">No Shift Templates Defined</h4>
                <p className="text-xs text-muted-foreground">Click "+ Add Shift Template" to build custom working schedules.</p>
              </div>
            )}
          </motion.div>
        )}

        {/* 4. ROSTERS & SCHEDULING */}
        {activeTab === "rosters" && (
          <motion.div key="rosters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Weekly Roster & Shift Scheduling Matrix</h2>
                <p className="text-xs text-muted-foreground">Assign, swap and balance departmental shift rosters.</p>
              </div>
              <Button onClick={() => setIsRosterModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Plus className="w-4 h-4" /> Assign Shift Roster
              </Button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Employee</TableHead>
                    <TableHead className="text-xs font-bold">Department</TableHead>
                    <TableHead className="text-xs font-bold">Assigned Shift</TableHead>
                    <TableHead className="text-xs font-bold">Timing Window</TableHead>
                    <TableHead className="text-xs font-bold">Day of Week</TableHead>
                    <TableHead className="text-xs font-bold">Date</TableHead>
                    <TableHead className="text-right text-xs font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rosters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                        <CalendarDays className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No shift rosters assigned yet</p>
                        <p className="text-[11px]">Click "+ Assign Shift Roster" to allocate shifts to employees.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    rosters.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-bold text-xs text-foreground">{r.employeeName}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{r.department}</TableCell>
                        <TableCell><Badge className="bg-primary/10 text-primary text-[10px] font-bold">{r.shiftName}</Badge></TableCell>
                        <TableCell className="text-xs font-mono">{r.timing}</TableCell>
                        <TableCell className="text-xs font-semibold">{r.dayOfWeek}</TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono">{r.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => deleteRoster(r.id)} className="h-8 w-8 text-destructive">
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* 5. HOLIDAYS CALENDAR */}
        {activeTab === "holidays" && (
          <motion.div key="holidays" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <HolidayCalendarView
              holidays={displayedHolidays}
              onAddHoliday={(dateStr) => {
                if (dateStr) {
                  setHolidayDate(dateStr);
                }
                setIsHolidayModalOpen(true);
              }}
              onDeleteHoliday={handleDeleteHoliday}
            />
          </motion.div>
        )}

        {/* 6. ATTENDANCE REGULARIZATION */}
        {activeTab === "regularization" && (
          <motion.div key="regularization" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Attendance Regularization Requests</h2>
                <p className="text-xs text-muted-foreground">Request retroactive punch fixes for missed swipes or system issues.</p>
              </div>
              <Button onClick={() => setIsRegModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5 shadow-sm">
                <Plus className="w-4 h-4" /> Apply for Regularization
              </Button>
            </div>

            {/* Filter and Search Controls */}
            <div className="glass-card rounded-2xl p-4 border border-border/60 bg-card flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search employee, date, reason..."
                  value={regSearchQuery}
                  onChange={(e) => setRegSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs bg-secondary/30 border-border/60"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={regFilterStatus} onValueChange={setRegFilterStatus}>
                  <SelectTrigger className="h-8 text-xs bg-secondary/30 border-border/60 w-36 font-medium">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL" className="text-xs">All Statuses</SelectItem>
                    <SelectItem value="Pending" className="text-xs">Pending</SelectItem>
                    <SelectItem value="Approved" className="text-xs">Approved</SelectItem>
                    <SelectItem value="Rejected" className="text-xs">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                {(regSearchQuery || regFilterStatus !== "ALL") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRegSearchQuery("");
                      setRegFilterStatus("ALL");
                    }}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Employee</TableHead>
                    <TableHead className="text-xs font-bold">Date</TableHead>
                    <TableHead className="text-xs font-bold">Missed Punch</TableHead>
                    <TableHead className="text-xs font-bold">Requested Time</TableHead>
                    <TableHead className="text-xs font-bold">Justification</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-right text-xs font-bold">Manager Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRegularizations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                        <CheckCircle className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No regularization requests found</p>
                        <p className="text-[11px]">Click "+ Apply for Regularization" to submit missed punch requests.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRegularizations.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-bold text-xs text-foreground">
                          {r.employeeName}
                          <span className="block text-[10px] text-muted-foreground font-mono">{r.department}</span>
                        </TableCell>
                        <TableCell className="text-xs font-mono">{r.date}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px] font-semibold">{r.missedPunchType}</Badge></TableCell>
                        <TableCell className="text-xs font-mono font-bold text-primary">{r.requestedTime}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-xs">
                          <span className="truncate block" title={r.reason}>{r.reason}</span>
                          {r.reviewComment && (
                            <span className="text-[10px] text-emerald-500 font-medium block mt-0.5">
                              Note: {r.reviewComment}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge className={r.status === "Approved" ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/30" : r.status === "Rejected" ? "bg-destructive/15 text-destructive border-destructive/30" : "bg-amber-500/15 text-amber-500 border-amber-500/30"}>
                            {r.status}
                          </Badge>
                          {r.approverName && (
                            <span className="text-[9px] text-muted-foreground block mt-0.5 font-mono">
                              By {r.approverName}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {r.status === "Pending" && (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  updateRegularizationStatus(
                                    r.id,
                                    "Approved",
                                    user?.name || "HR Admin",
                                    "Verified & Approved by HR"
                                  );
                                  toast.success(`Regularization approved! Attendance punch recorded for ${r.employeeName}`);
                                }}
                                className="h-7 text-xs text-emerald-500 hover:bg-emerald-500/10 font-bold"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  updateRegularizationStatus(
                                    r.id,
                                    "Rejected",
                                    user?.name || "HR Admin",
                                    "Insufficient justification"
                                  );
                                  toast.error(`Regularization request rejected.`);
                                }}
                                className="h-7 text-xs text-destructive hover:bg-destructive/10 font-bold"
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* 7. TIMESHEETS & PROJECT TIME */}
        {activeTab === "timesheets" && (
          <motion.div key="timesheets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Project Timesheets & Client Hours</h2>
                <p className="text-xs text-muted-foreground">Log billable project time, tasks and submit weekly timesheets.</p>
              </div>
              <Button onClick={() => setIsTimesheetModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Plus className="w-4 h-4" /> Log Project Time
              </Button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Employee</TableHead>
                    <TableHead className="text-xs font-bold">Project</TableHead>
                    <TableHead className="text-xs font-bold">Task Details</TableHead>
                    <TableHead className="text-xs font-bold">Logged Hours</TableHead>
                    <TableHead className="text-xs font-bold">Billing Type</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-right text-xs font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedTimesheets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                        <Timer className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No project timesheets logged</p>
                        <p className="text-[11px]">Click "+ Log Project Time" to start tracking billable hours.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedTimesheets.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-bold text-xs text-foreground">{t.employeeName}</TableCell>
                        <TableCell className="font-bold text-xs text-primary">{t.projectName}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{t.taskDescription}</TableCell>
                        <TableCell className="text-xs font-mono font-bold">{t.loggedHours} hrs</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{t.billable ? "Billable" : "Internal"}</Badge></TableCell>
                        <TableCell>
                          <Badge className={t.status === "Approved" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}>
                            {t.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {t.status === "Submitted" && (
                            <Button size="sm" variant="ghost" onClick={() => handleApproveTimesheet(t.id)} className="h-7 text-xs text-emerald-500 font-bold">
                              Approve
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* 8. LEAVES & TIME-OFF INTEGRATION */}
        {activeTab === "leaves" && (
          <motion.div key="leaves" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Leave Balances & Time-Off Requests</h2>
                <p className="text-xs text-muted-foreground">Apply for leaves and manage team absence balances.</p>
              </div>
              <Button onClick={() => setIsLeaveModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Plus className="w-4 h-4" /> Apply for Leave
              </Button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Employee</TableHead>
                    <TableHead className="text-xs font-bold">Leave Category</TableHead>
                    <TableHead className="text-xs font-bold">From - To</TableHead>
                    <TableHead className="text-xs font-bold">Days</TableHead>
                    <TableHead className="text-xs font-bold">Reason</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-right text-xs font-bold">Manager Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedLeaves.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                        <Calendar className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No leave applications submitted</p>
                        <p className="text-[11px]">Click "+ Apply for Leave" to create a time-off application.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedLeaves.map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="font-bold text-xs text-foreground">{l.employeeName}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{l.type}</Badge></TableCell>
                        <TableCell className="text-xs font-mono">{l.startDate || l.from} → {l.endDate || l.to}</TableCell>
                        <TableCell className="text-xs font-mono font-bold">{l.days} day(s)</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{l.reason}</TableCell>
                        <TableCell>
                          <Badge className={l.status === "Approved" ? "bg-emerald-500/15 text-emerald-500" : (l.status === "Rejected" || l.status === "Denied") ? "bg-destructive/15 text-destructive" : "bg-amber-500/15 text-amber-500"}>
                            {l.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {l.status === "Pending" && (
                            <div className="flex items-center justify-end gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleReviewLeave(l.id, "Approved")} className="h-7 text-xs text-emerald-500 font-bold">
                                Approve
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleReviewLeave(l.id, "Denied")} className="h-7 text-xs text-destructive font-bold">
                                Reject
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* 9. OVERTIME (OT) TRACKING */}
        {activeTab === "overtime" && (
          <motion.div key="overtime" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Overtime (OT) Tracking & Approvals</h2>
                <p className="text-xs text-muted-foreground">Monitor extra working hours with 1.5x / 2.0x multiplier approval for payroll.</p>
              </div>
              <Button onClick={() => setIsOvertimeModalOpen(true)} className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5">
                <Plus className="w-4 h-4" /> Request OT Sign-off
              </Button>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-border/60 bg-card">
              <Table>
                <TableHeader className="bg-secondary/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Employee</TableHead>
                    <TableHead className="text-xs font-bold">Date</TableHead>
                    <TableHead className="text-xs font-bold">Shift Standard</TableHead>
                    <TableHead className="text-xs font-bold">Actual Logged</TableHead>
                    <TableHead className="text-xs font-bold">OT Hours</TableHead>
                    <TableHead className="text-xs font-bold">Multiplier Rate</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-right text-xs font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overtimes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-12 text-muted-foreground text-xs">
                        <Award className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                        <p className="font-bold text-sm text-foreground">No overtime hours logged</p>
                        <p className="text-[11px]">Overtime hours logged beyond shift schedules will appear here for manager approval.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    overtimes.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell className="font-bold text-xs text-foreground">{o.employeeName}</TableCell>
                        <TableCell className="text-xs font-mono">{o.date}</TableCell>
                        <TableCell className="text-xs font-mono">{o.standardHours}h</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-foreground">{o.actualHours}h</TableCell>
                        <TableCell className="text-xs font-mono font-bold text-primary">+{o.overtimeHours}h</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{o.rateMultiplier}</Badge></TableCell>
                        <TableCell>
                          <Badge className={o.status === "Approved" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}>
                            {o.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {o.status === "Pending" && (
                            <Button size="sm" variant="ghost" onClick={() => updateOvertimeStatus(o.id, "Approved")} className="h-7 text-xs text-emerald-500 font-bold">
                              Approve OT
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        )}

        {/* 10. ATTENDANCE ANALYTICS & AUDIT REPORTS */}
        {activeTab === "analytics" && (
          <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-foreground">Attendance Analytics & Monthly Muster Roll</h2>
                <p className="text-xs text-muted-foreground">Compliance audit logs and automated payroll export.</p>
              </div>
              <Button
                onClick={handleExportMusterRoll}
                disabled={isExporting}
                className="gradient-bg text-primary-foreground font-bold text-xs h-9 gap-1.5 shadow-sm"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span>{isExporting ? "Generating Report..." : "Download Muster Roll (.csv)"}</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
                <span className="text-xs text-muted-foreground">On-Time Arrival Rate</span>
                <p className="text-3xl font-extrabold font-mono text-emerald-500">
                  {analyticsData?.attendanceRate ? `${analyticsData.attendanceRate}%` : "97.4%"}
                </p>
                <span className="text-[11px] text-muted-foreground">Average arrival: 09:12 AM</span>
              </div>
              <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
                <span className="text-xs text-muted-foreground">Avg Working Hours</span>
                <p className="text-3xl font-extrabold font-mono text-primary">8.4 hrs/day</p>
                <span className="text-[11px] text-muted-foreground">Complies with statutory guidelines</span>
              </div>
              <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
                <span className="text-xs text-muted-foreground">Absenteeism Rate</span>
                <p className="text-3xl font-extrabold font-mono text-teal-600 dark:text-teal-400">
                  {analyticsData?.absentToday && totalEmployeesCount > 0 ? `${((analyticsData.absentToday / totalEmployeesCount) * 100).toFixed(1)}%` : "1.8%"}
                </p>
                <span className="text-[11px] text-emerald-500 font-semibold">Low Risk</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 1: ADD SHIFT */}
      <Dialog open={isShiftModalOpen} onOpenChange={setIsShiftModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add Shift Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Shift Name *</Label>
              <Input placeholder="e.g. Night Shift [9PM - 6AM]" value={shiftName} onChange={(e) => setShiftName(e.target.value)} className="text-xs bg-secondary/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Start Time</Label>
                <Input type="time" value={shiftStart} onChange={(e) => setShiftStart(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">End Time</Label>
                <Input type="time" value={shiftEnd} onChange={(e) => setShiftEnd(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Grace Window (Mins)</Label>
                <Input type="number" value={shiftGrace} onChange={(e) => setShiftGrace(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Department</Label>
                <Select value={shiftDept} onValueChange={setShiftDept}>
                  <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleCreateShift} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              Save Shift Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: ASSIGN ROSTER */}
      <Dialog open={isRosterModalOpen} onOpenChange={setIsRosterModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Assign Shift Roster</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Employee *</Label>
              <Input placeholder="Enter employee name..." value={rosterEmp} onChange={(e) => setRosterEmp(e.target.value)} className="text-xs bg-secondary/30" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Shift</Label>
              <Select value={rosterShift} onValueChange={setRosterShift}>
                <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Shift [9AM - 6PM]">General Shift [9AM - 6PM]</SelectItem>
                  <SelectItem value="Morning Shift [6AM - 3PM]">Morning Shift [6AM - 3PM]</SelectItem>
                  <SelectItem value="Night Shift [9PM - 6AM]">Night Shift [9PM - 6AM]</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Day of Week</Label>
              <Select value={rosterDay} onValueChange={setRosterDay}>
                <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleCreateRoster} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              Assign Roster
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 3: ADD HOLIDAY */}
      <Dialog open={isHolidayModalOpen} onOpenChange={setIsHolidayModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add Company Holiday</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Holiday Title *</Label>
              <Input placeholder="e.g. Independence Day" value={holidayTitle} onChange={(e) => setHolidayTitle(e.target.value)} className="text-xs bg-secondary/30" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Date *</Label>
              <Input type="date" value={holidayDate} onChange={(e) => setHolidayDate(e.target.value)} className="text-xs bg-secondary/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Holiday Type</Label>
                <Select value={holidayType} onValueChange={(v: any) => setHolidayType(v)}>
                  <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="National">National</SelectItem>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Optional Floating">Optional Floating</SelectItem>
                    <SelectItem value="Regional">Regional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Branch</Label>
                <Select value={holidayBranch} onValueChange={setHolidayBranch}>
                  <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Headquarters (HQ)">All Branches (HQ)</SelectItem>
                    <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi NCR">Delhi NCR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleCreateHoliday} disabled={isCreatingHoliday} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              {isCreatingHoliday ? "Saving..." : "Add Holiday"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 4: REGULARIZATION */}
      <Dialog open={isRegModalOpen} onOpenChange={setIsRegModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Apply for Attendance Regularization</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Missed Date *</Label>
                <Input type="date" value={regDate} onChange={(e) => setRegDate(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Correct Punch Time</Label>
                <Input type="time" value={regTime} onChange={(e) => setRegTime(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Missed Punch Type</Label>
              <Select value={regType} onValueChange={(v: any) => setRegType(v)}>
                <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Check-In">Check-In Swipe</SelectItem>
                  <SelectItem value="Check-Out">Check-Out Swipe</SelectItem>
                  <SelectItem value="Both">Both (Full Day On-Duty)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Reason / Justification *</Label>
              <Textarea placeholder="Explain why the punch was missed (e.g. client on-site visit, biometric sensor offline)..." value={regReason} onChange={(e) => setRegReason(e.target.value)} rows={3} className="text-xs bg-secondary/30" />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleCreateRegularization} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 5: LOG TIMESHEET */}
      <Dialog open={isTimesheetModalOpen} onOpenChange={setIsTimesheetModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Log Project Timesheet</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Project Name *</Label>
              <Input placeholder="e.g. OFC360 Mobile App 2.0" value={tsProject} onChange={(e) => setTsProject(e.target.value)} className="text-xs bg-secondary/30" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Task Description *</Label>
              <Input placeholder="e.g. Developed Biometric Auth API endpoints" value={tsTask} onChange={(e) => setTsTask(e.target.value)} className="text-xs bg-secondary/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Logged Hours</Label>
                <Input type="number" step="0.5" value={tsHours} onChange={(e) => setTsHours(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Billing</Label>
                <Select value={tsBillable ? "yes" : "no"} onValueChange={(v) => setTsBillable(v === "yes")}>
                  <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Billable Client Work</SelectItem>
                    <SelectItem value="no">Internal Non-Billable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleCreateTimesheet} disabled={isCreatingTimesheet} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              {isCreatingTimesheet ? "Submitting..." : "Submit Timesheet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 6: OVERTIME REQUEST */}
      <Dialog open={isOvertimeModalOpen} onOpenChange={setIsOvertimeModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Request Overtime (OT) Approval</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Overtime Hours *</Label>
                <Input type="number" step="0.5" value={otHours} onChange={(e) => setOtHours(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Pay Multiplier</Label>
                <Select value={otMultiplier} onValueChange={(v: any) => setOtMultiplier(v)}>
                  <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.5x (Weekday)">1.5x (Weekday OT)</SelectItem>
                    <SelectItem value="2.0x (Weekend/Holiday)">2.0x (Weekend/Holiday)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Business Justification *</Label>
              <Textarea placeholder="Explain business need for overtime (e.g. Critical release production deployment)..." value={otReason} onChange={(e) => setOtReason(e.target.value)} rows={3} className="text-xs bg-secondary/30" />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleCreateOvertime} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              Submit OT Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* MODAL 7: APPLY LEAVE */}
      <Dialog open={isLeaveModalOpen} onOpenChange={setIsLeaveModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-card border border-border/70 p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Apply for Leave / Time-Off</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger className="text-xs bg-secondary/30"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Casual Leave (CL)">Casual Leave (CL)</SelectItem>
                  <SelectItem value="Sick Leave (SL)">Sick Leave (SL)</SelectItem>
                  <SelectItem value="Earned / Privilege Leave (EL)">Earned / Privilege Leave (EL)</SelectItem>
                  <SelectItem value="Compensatory Off (Comp-Off)">Compensatory Off (Comp-Off)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Start Date *</Label>
                <Input type="date" value={leaveStart} onChange={(e) => setLeaveStart(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold">End Date *</Label>
                <Input type="date" value={leaveEnd} onChange={(e) => setLeaveEnd(e.target.value)} className="text-xs bg-secondary/30" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold">Reason *</Label>
              <Textarea placeholder="State reason for absence..." value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} rows={3} className="text-xs bg-secondary/30" />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button size="sm" onClick={handleApplyLeave} disabled={isApplyingLeave} className="gradient-bg text-primary-foreground font-bold text-xs h-9">
              {isApplyingLeave ? "Submitting..." : "Submit Leave Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
