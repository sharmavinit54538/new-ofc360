import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Database, ShieldAlert, Sparkles } from "lucide-react";

interface DataRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName?: string;
}

export function DataRequiredModal({ open, onOpenChange, moduleName }: DataRequiredModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/60 bg-card/95 backdrop-blur-xl">
        <DialogHeader className="space-y-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto sm:mx-0">
            <Database className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            Organizational Data Required
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground leading-relaxed">
            {moduleName ? (
              <>
                <span className="font-semibold text-foreground">{moduleName}</span> requires organizational data before insights can be generated.
              </>
            ) : (
              "Intelligence Hub requires organizational data before insights can be generated."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 p-3.5 rounded-lg bg-muted/50 border border-border/50 text-xs text-muted-foreground flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>
            Connect your HR data sources, performance records, or attendance logs to enable automated intelligence modeling.
          </span>
        </div>

        <DialogFooter className="flex sm:justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button 
            className="gradient-bg text-primary-foreground hover:opacity-90 transition-opacity gap-1.5"
            onClick={() => onOpenChange(false)}
          >
            <Sparkles className="w-4 h-4" />
            Understood
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}