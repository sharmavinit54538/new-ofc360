import { Card } from "@/components/ui/card";
import { usePunchCardData } from "./components/punchCard/usePunchCardData";
import { usePunchCardModal } from "./components/punchCard/usePunchCardModal";
import { PunchCardHeader } from "./components/punchCard/PunchCardHeader";
import { PunchCardContent } from "./components/punchCard/PunchCardContent";
import { PunchCardCameraDialog } from "./components/punchCard/PunchCardCameraDialog";

export function AttendancePunchCard() {
  const d = usePunchCardData();
  const m = usePunchCardModal(d);
  return (
    <Card className="border border-border/80 shadow-sm bg-card overflow-hidden">
      <PunchCardHeader />
      <PunchCardContent today={d.today} isCheckedIn={d.isCheckedIn} isCheckedOut={d.isCheckedOut} isLoading={d.isCheckingIn || d.isCheckingOut} onOpenModal={m.openModal} />
      <PunchCardCameraDialog isOpen={m.isOpen} onOpenChange={m.setIsOpen} actionType={m.actionType} camera={d.camera} onConfirm={m.confirmPunch} isLoading={d.isCheckingIn || d.isCheckingOut} />
    </Card>
  );
}
export default AttendancePunchCard;