import { useState } from "react";
import { toast } from "sonner";

export function usePunchCardModal(d: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [actionType, setActionType] = useState<"check-in" | "check-out">("check-in");

  const openModal = (type: "check-in" | "check-out") => { setActionType(type); setIsOpen(true); d.camera.startLiveCamera(); };
  const confirmPunch = async () => {
    if (!d.camera.capturedSelfie) { toast.error("Please capture your selfie."); return; }
    try {
      if (actionType === "check-in") await d.checkInApi({ file: d.camera.capturedSelfie.blob }).unwrap();
      else await d.checkOutApi({ file: d.camera.capturedSelfie.blob }).unwrap();
      d.refetch(); setIsOpen(false); d.camera.clearCapturedSelfie();
      toast.success(`Successfully recorded ${actionType}!`);
    } catch (e: any) { toast.error(e?.data?.message || "Failed to record punch."); }
  };
  return { isOpen, setIsOpen, actionType, openModal, confirmPunch };
}
