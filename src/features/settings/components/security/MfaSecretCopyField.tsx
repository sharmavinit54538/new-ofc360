import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MfaSecretCopyField({ secret, copied, onCopy }: { secret: string; copied: boolean; onCopy: () => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs font-semibold text-foreground">Manual Setup Key</Label>
      <div className="flex items-center gap-2">
        <Input readOnly value={secret} className="bg-secondary/40 font-mono text-xs tracking-wider" />
        <Button type="button" size="sm" variant="outline" onClick={onCopy} className="shrink-0 h-10 px-3 text-xs gap-1">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
}
