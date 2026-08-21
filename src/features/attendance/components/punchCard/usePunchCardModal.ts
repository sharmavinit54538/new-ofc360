import { useState } from "react";
import { toast } from "sonner";
import type { usePunchCardData } from "./usePunchCardData";

export function usePunchCardModal(d: ReturnType<typeof usePunchCardData>) {
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
    } catch (e: unknown) { const err = e as { data?: { message?: string } }; toast.error(err?.data?.message || "Failed to record punch."); }
  };
  return { isOpen, setIsOpen, actionType, openModal, confirmPunch };
}
