import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { normalizeError } from "@/services/api/normalizeError";

interface Step7AdditionalDetailsProps {
  initialData?: {
    shirt_size?: string;
    dietary_preference?: string;
    bio?: string;
    hobbies?: string;
  };
  onSave: (data: {
    shirt_size: string;
    dietary_preference: string;
    bio: string;
    hobbies: string;
  }) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

export function Step7AdditionalDetails({ initialData, onSave, onBack, isLoading }: Step7AdditionalDetailsProps) {
  const [formData, setFormData] = useState({
    shirt_size: initialData?.shirt_size || "M",
    dietary_preference: initialData?.dietary_preference || "Standard",
    bio: initialData?.bio || "",
    hobbies: initialData?.hobbies || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      toast.success("Step 7 (Additional Details) saved!");
    } catch (err: any) {
      toast.error(normalizeError(err).message);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <h3 className="text-xl font-bold text-foreground">Step 7 — Additional Preferences</h3>
        <p className="text-xs text-muted-foreground">Apparel size, dietary needs, and personal bio.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-xs font-semibold">Apparel / Shirt Size</Label>
          <Select value={formData.shirt_size} onValueChange={(val) => setFormData({ ...formData, shirt_size: val })}>
            <SelectTrigger className="text-xs h-8">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="XS">XS</SelectItem>
              <SelectItem value="S">S</SelectItem>
              <SelectItem value="M">M</SelectItem>
              <SelectItem value="L">L</SelectItem>
              <SelectItem value="XL">XL</SelectItem>
              <SelectItem value="XXL">XXL</SelectItem>
              <SelectItem value="3XL">3XL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-semibold">Dietary Preference</Label>
          <Select value={formData.dietary_preference} onValueChange={(val) => setFormData({ ...formData, dietary_preference: val })}>
            <SelectTrigger className="text-xs h-8">
              <SelectValue placeholder="Select Preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Vegetarian">Vegetarian</SelectItem>
              <SelectItem value="Vegan">Vegan</SelectItem>
              <SelectItem value="Halal">Halal</SelectItem>
              <SelectItem value="Jain">Jain</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1 sm:col-span-2">
        <Label className="text-xs font-semibold">Short Bio / About Me</Label>
        <Textarea
          placeholder="Tell us a bit about yourself..."
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
          className="text-xs bg-secondary/30 border-border/60 rounded-xl resize-none font-sans"
        />
      </div>

      <div className="space-y-1 sm:col-span-2">
        <Label className="text-xs font-semibold">Hobbies & Interests</Label>
        <Textarea
          placeholder="e.g. Reading, Hiking, Photography..."
          value={formData.hobbies}
          onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
          rows={3}
          className="text-xs bg-secondary/30 border-border/60 rounded-xl resize-none font-sans"
        />
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="text-xs">Back</Button>
        <Button type="submit" disabled={isLoading} className="gradient-bg gap-2 text-xs">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Save & Continue <ArrowRight className="w-4 h-4" /></>}
        </Button>
      </div>
    </motion.form>
  );
}