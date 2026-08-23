import { useFaceAttendanceData } from "./hooks/useFaceAttendanceData";
import { useFaceActions } from "./hooks/useFaceActions";
import { AIFaceBody } from "./components/AIFaceBody";

export default function AIFaceAttendancePage() {
  const data = useFaceAttendanceData();
  const actions = useFaceActions(data);
  return <AIFaceBody d={data} actions={actions} />;
}