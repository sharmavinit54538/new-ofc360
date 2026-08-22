import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BasicInfoState } from "../types/basicInfoTypes";

export function BasicInfoAvatarField({ b }: { b: BasicInfoState }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">Profile Photo Avatar URL</Label>
      <Input
        placeholder="https://images.unsplash.com/photo-..."
        value={b.photoUrl}
        onChange={(e) => b.setPhotoUrl(e.target.value)}
        className="bg-secondary/30 text-xs h-10 border-border/60"
      />
    </div>
  );
}
