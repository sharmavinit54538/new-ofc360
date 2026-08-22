import { AlertTriangle, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

export function MfaDisableDialog({ open, onOpenChange, isDisabling, onConfirm }: { open: boolean; onOpenChange: (o: boolean) => void; isDisabling: boolean; onConfirm: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/80 shadow-2xl rounded-2xl">
        <DialogHeader><DialogTitle className="text-base font-bold text-foreground flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /><span>Disable Two-Factor Authentication?</span></DialogTitle><DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">Disabling 2FA will remove the extra layer of security on your administrator account.</DialogDescription></DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 pt-4">
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} className="text-xs">Keep 2FA Enabled</Button>
          <Button type="button" variant="destructive" size="sm" disabled={isDisabling} onClick={onConfirm} className="text-xs gap-1.5">{isDisabling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />} Yes, Disable 2FA</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
