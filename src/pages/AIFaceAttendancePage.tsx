import { useFaceAttendanceData } from "./ai-face-attendance/hooks/useFaceAttendanceData";
import { useFaceActions } from "./ai-face-attendance/hooks/useFaceActions";
import { AIFaceBody } from "./ai-face-attendance/components/AIFaceBody";

export default function AIFaceAttendancePage() {
  const data = useFaceAttendanceData();
  const actions = useFaceActions(data);
  return <AIFaceBody d={data} actions={actions} />;
}