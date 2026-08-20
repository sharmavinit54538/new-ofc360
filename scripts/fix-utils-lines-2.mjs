import fs from 'fs';

// 6. src/utils/attendance/determineAttendanceStatus.ts
const determineAttendance = `import type { ShiftTiming, AttendanceCalculatedStatus } from "./types";
import { calculateDurationMinutes, computeNetWorkHours } from "./durationCalculations";
import { evaluateArrivalStatus } from "./evaluateArrivalDeparture";

export function determineAttendanceStatus(params: {
  checkInTimeStr?: string; checkOutTimeStr?: string; shift: ShiftTiming;
  breakDurationMinutes?: number; isOnLeave?: boolean; isHoliday?: boolean;
  isWeeklyOff?: boolean; isRegularized?: boolean;
}): AttendanceCalculatedStatus {
  const { checkInTimeStr: inT, checkOutTimeStr: outT, shift, breakDurationMinutes = 0 } = params;
  if (params.isRegularized) return "Regularized";
  if (params.isOnLeave) return "On Leave";
  if (params.isHoliday) return "Holiday";
  if (params.isWeeklyOff) return "Week Off";
  if (!inT && !outT) return "Missing Punch";
  if (inT && !outT) return evaluateArrivalStatus(inT, shift.startTime, shift.gracePeriodMins).isLate ? "Late" : "On Time";
  const { netHoursDecimal } = computeNetWorkHours(calculateDurationMinutes(inT!, outT!), breakDurationMinutes);
  if (netHoursDecimal < (shift.halfDayHours ?? 4.5)) return "Half Day";
  if (netHoursDecimal > (shift.fullDayHours ?? 8.0) + 0.5) return "Overtime";
  return evaluateArrivalStatus(inT!, shift.startTime, shift.gracePeriodMins).isLate ? "Late" : "On Time";
}
`;
fs.writeFileSync('src/utils/attendance/determineAttendanceStatus.ts', determineAttendance, 'utf8');

// 7. src/utils/attendance/durationCalculations.ts -> split formatSeconds
const formatSeconds = `export function formatSecondsToHms(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return \`\${String(h).padStart(2, "0")}:\${String(m).padStart(2, "0")}:\${String(s).padStart(2, "0")}\`;
}
`;
fs.writeFileSync('src/utils/attendance/formatSeconds.ts', formatSeconds, 'utf8');

const durationCalc = `import { timeStringToMinutes } from "./timeConversions";
export { formatSecondsToHms } from "./formatSeconds";

export function calculateDurationMinutes(start: string, end: string): number {
  const s = timeStringToMinutes(start);
  const e = timeStringToMinutes(end);
  return e >= s ? e - s : 1440 - s + e;
}

export function computeNetWorkHours(gross: number, breakMins = 0) {
  const netMinutes = Math.max(0, gross - breakMins);
  const netHoursDecimal = Number((netMinutes / 60).toFixed(2));
  const h = Math.floor(netMinutes / 60);
  const m = netMinutes % 60;
  return { netMinutes, netHoursDecimal, formattedNetDuration: \`\${String(h).padStart(2, "0")}h \${String(m).padStart(2, "0")}m\` };
}
`;
fs.writeFileSync('src/utils/attendance/durationCalculations.ts', durationCalc, 'utf8');

// 8. src/utils/currency/formatCurrency.ts -> split fmtMoney
const formatCurrency = `import { getCurrencyConfig } from "./getCurrencyConfig";
import { getCurrencySymbol } from "./getCurrencySymbol";

export function formatCurrency(amount: number, currencyStr?: string): string {
  if (typeof amount !== "number" || isNaN(amount)) return \`\${getCurrencySymbol(currencyStr)}0\`;
  const cfg = getCurrencyConfig(currencyStr);
  try {
    return new Intl.NumberFormat(cfg.locale, { style: "currency", currency: cfg.code, maximumFractionDigits: 0 }).format(amount);
  } catch (e) {
    return \`\${cfg.symbol}\${amount.toLocaleString()}\`;
  }
}

export const fmtMoney = formatCurrency;
`;
fs.writeFileSync('src/utils/currency/formatCurrency.ts', formatCurrency, 'utf8');

// 9. src/utils/payroll/computeEmployeePayroll.ts
const computePayroll = `import type { DetailedPayrollComputation } from "./detailedComputationType";
import { decomposeCtc } from "./decomposeCtc";
import { calculatePfContribution, calculateEsiContribution, calculateProfessionalTax } from "./pfEsiTax";
import { calculateMonthlyTds } from "./calculateMonthlyTds";

export function computeEmployeePayroll(p: any): DetailedPayrollComputation {
  const comp = decomposeCtc(p.annualCtc);
  const ot = Math.round((p.approvedOvertimeHours || 0) * (p.hourlyOtRate || 500) * 1.5);
  const lop = Math.round((p.lopDays || 0) * (comp.grossMonthly / (p.daysInMonth || 30)));
  const gross = Math.max(0, comp.grossMonthly + (p.approvedBonus || 0) + ot - lop);
  const pf = calculatePfContribution(comp.basic);
  const esi = calculateEsiContribution(gross);
  const pt = calculateProfessionalTax(gross);
  const tds = calculateMonthlyTds(p.annualCtc, p.taxRegime, p.declared80C || 0, p.declared80D || 0);
  const stat = { employeePf: pf.employeePf, employerPf: pf.employerPf, employeeEsi: esi.employeeEsi, employerEsi: esi.employerEsi, professionalTax: pt, monthlyTds: tds, totalEmployeeDeductions: pf.employeePf + esi.employeeEsi + pt + tds };
  const totalDed = stat.totalEmployeeDeductions + (p.activeSalaryAdvanceEmi || 0);
  return {
    employeeId: p.employeeId, employeeName: p.employeeName, annualCtc: p.annualCtc, monthlyCtc: Math.round(p.annualCtc / 12), components: comp,
    bonusAmount: p.approvedBonus || 0, overtimeAmount: ot, reimbursementAmount: p.approvedReimbursement || 0, grossEarnings: gross, statutoryDeductions: stat,
    advanceEmiDeduction: p.activeSalaryAdvanceEmi || 0, lopDays: p.lopDays || 0, lopDeduction: lop, totalDeductions: totalDed,
    netSalary: Math.max(0, gross - totalDed + (p.approvedReimbursement || 0)),
  };
}
`;
fs.writeFileSync('src/utils/payroll/computeEmployeePayroll.ts', computePayroll, 'utf8');

// 10. src/utils/time/formatMessageTime.ts
const formatMsgTime = `import { parseDate } from "./parseDate";
import { isSameDay } from "./isSameDay";

export function formatMessageTime(raw?: string | number | Date | null): string {
  if (!raw) return "";
  const d = parseDate(raw);
  if (!d || isNaN(d.getTime())) return typeof raw === "string" && raw.length < 15 && !raw.includes("T") ? raw : "";
  const now = new Date();
  const timeStr = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  if (isSameDay(d, now)) return timeStr;
  if (isSameDay(d, new Date(now.getTime() - 86400000))) return \`Yesterday, \${timeStr}\`;
  const isSameYear = d.getFullYear() === now.getFullYear();
  const dateStr = d.toLocaleDateString([], { day: "numeric", month: "short", year: isSameYear ? undefined : "numeric" });
  return \`\${dateStr}, \${timeStr}\`;
}
`;
fs.writeFileSync('src/utils/time/formatMessageTime.ts', formatMsgTime, 'utf8');

// 11. src/utils/timeline/calculateWorkAnniversaries.ts
const calculateAnniversaries = `import type { TimelineEvent } from "./timelineEvent";

export function calculateWorkAnniversaries(empId: string, name: string, joinDateStr: string): TimelineEvent[] {
  if (!joinDateStr) return [];
  const joinDate = new Date(joinDateStr);
  const now = new Date();
  if (isNaN(joinDate.getTime()) || joinDate > now) return [];
  const events: TimelineEvent[] = [{ id: \`ANNIV-JOIN-\${empId}\`, employeeId: empId, employeeName: name, category: "Anniversaries", title: "Joined Company", date: joinDate.toISOString().split("T")[0], badge: "Day 1", description: \`\${name} joined OFC360.\`, details: { yearsCompleted: 0 } }];
  [1, 2, 3, 5, 10].forEach((y) => {
    const anniv = new Date(joinDate);
    anniv.setFullYear(joinDate.getFullYear() + y);
    if (anniv <= now) {
      events.push({ id: \`ANNIV-\${y}YR-\${empId}\`, employeeId: empId, employeeName: name, category: "Anniversaries", title: \`\${y} Year Anniversary\`, date: anniv.toISOString().split("T")[0], badge: \`\${y} Yrs\`, description: \`\${y} yrs service.\`, details: { yearsCompleted: y } });
    }
  });
  return events;
}
`;
fs.writeFileSync('src/utils/timeline/calculateWorkAnniversaries.ts', calculateAnniversaries, 'utf8');

// 12. src/utils/timeline/types.ts
const timelineTypes = `export type TimelineCategory = "Career" | "Recognition" | "Anniversaries" | "Projects" | "Skills" | "Audit";

export interface TimelineEventDetails {
  previousRole?: string; newRole?: string; previousDepartment?: string; newDepartment?: string;
  previousSalary?: string; newSalary?: string; givenBy?: string; awardType?: string;
  yearsCompleted?: number; skillName?: string; previousLevel?: string; newLevel?: string;
  source?: string; projectName?: string; impact?: string; actor?: string;
}
`;
fs.writeFileSync('src/utils/timeline/types.ts', timelineTypes, 'utf8');

// 13. src/utils/validation/fileValidation.ts
const fileVal = `export interface FileValidationResult { valid: boolean; error?: string; }

export function validateImageFile(file: File, allowed = ["image/jpeg", "image/png", "image/webp"], maxBytes = 5242880): FileValidationResult {
  if (!allowed.includes(file.type)) {
    return { valid: false, error: \`Invalid format (\${file.type}). Allowed: \${allowed.map((t) => t.replace("image/", "")).join(", ")}.\` };
  }
  if (file.size > maxBytes) {
    return { valid: false, error: \`File size exceeds limit of \${(maxBytes / 1048576).toFixed(0)} MB.\` };
  }
  return { valid: true };
}
`;
fs.writeFileSync('src/utils/validation/fileValidation.ts', fileVal, 'utf8');

// 14. src/utils/verification/captureVideoFrame.ts
const capVid = `import type { CameraCaptureResult } from "./types";
import { calculateBrightness } from "./calculateBrightness";

export function captureVideoFrame(video: HTMLVideoElement): CameraCaptureResult {
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context error");
  ctx.drawImage(video, 0, 0, w, h);
  const bright = calculateBrightness(ctx.getImageData(0, 0, w, h).data);
  if (bright < 10) throw new Error("Frame too dark.");
  return {
    dataUrl: canvas.toDataURL("image/jpeg", 0.88), width: w, height: h,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    faceHash: \`FAC-\${Math.random().toString(36).substring(2, 8).toUpperCase()}\`, brightnessScore: bright,
  };
}
`;
fs.writeFileSync('src/utils/verification/captureVideoFrame.ts', capVid, 'utf8');

// 15. src/utils/verification/streamControl.ts
const streamCtrl = `export async function startCameraStream(video: HTMLVideoElement): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera API not supported.");
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } }, audio: false,
  });
  video.srcObject = stream;
  await video.play();
  return stream;
}

export function stopCameraStream(stream: MediaStream | null): void {
  if (!stream) return;
  try { stream.getTracks().forEach((t) => t.stop()); } catch (err) { console.error(err); }
}
`;
fs.writeFileSync('src/utils/verification/streamControl.ts', streamCtrl, 'utf8');

console.log('Fixed utils part 2');
