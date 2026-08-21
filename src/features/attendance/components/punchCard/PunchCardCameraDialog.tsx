import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckinWebcamBox } from "../tabs/checkin/CheckinWebcamBox";
import { Button } from "@/components/ui/button";

export function PunchCardCameraDialog(p: {
  isOpen: boolean; onOpenChange: (o: boolean) => void;
  actionType: "check-in" | "check-out";
  camera: Parameters<typeof CheckinWebcamBox>[0]["camera"];
  onConfirm: () => void; isLoading: boolean;
}) {
  return (
    <Dialog open={p.isOpen} onOpenChange={p.onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold capitalize">Facial {p.actionType}</DialogTitle></DialogHeader>
        <div className="py-2 space-y-3">
          <CheckinWebcamBox camera={p.camera} />
          {p.camera.capturedSelfie && (<Button onClick={p.onConfirm} disabled={p.isLoading} className="w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">Confirm {p.actionType}</Button>)}
        </div>
      </DialogContent>
    </Dialog>
  );
}
