import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckinWebcamBox } from "../tabs/checkin/CheckinWebcamBox";
import { Button } from "@/components/ui/button";

export function PunchCardCameraDialog({ isOpen, onOpenChange, actionType, camera, onConfirm, isLoading }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="text-sm font-semibold capitalize">Facial {actionType}</DialogTitle></DialogHeader>
        <div className="py-2 space-y-3">
          <CheckinWebcamBox camera={camera} />
          {camera.capturedSelfie && (
            <Button onClick={onConfirm} disabled={isLoading} className="w-full h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
              Confirm {actionType}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
