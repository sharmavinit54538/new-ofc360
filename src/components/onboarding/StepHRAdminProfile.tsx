import { useState, useEffect } from "react";
import { HRAdminProfile } from "@/types/hrAdminOnboarding";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, Briefcase, Languages, Upload, X, ArrowRight, AlertCircle, Camera } from "lucide-react";
import { validateMobileNumber, validateImageFile, fileToBase64 } from "@/utils/onboardingValidation";

import { Loader2 } from "lucide-react";

interface StepHRAdminProfileProps {
  initialData: HRAdminProfile;
  onSave: (data: HRAdminProfile) => Promise<void> | void;
  onBack: () => void;
  isLoading?: boolean;
}

export function StepHRAdminProfile({ initialData, onSave, onBack, isLoading }: StepHRAdminProfileProps) {
  const [formData, setFormData] = useState<HRAdminProfile>(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        first_name: initialData.first_name || prev.first_name || "",
        last_name: initialData.last_name || prev.last_name || "",
        profile_photo: initialData.profile_photo !== undefined ? initialData.profile_photo : prev.profile_photo,
        mobile_number: initialData.mobile_number || prev.mobile_number || "",
        designation: initialData.designation || prev.designation || "HR Administrator",
        preferred_language: initialData.preferred_language || prev.preferred_language || "English",
      }));
    }
  }, [initialData]);

  const handleChange = (field: keyof HRAdminProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file, ["image/jpeg", "image/png", "image/webp"], 3 * 1024 * 1024); // 3MB limit
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      handleChange("profile_photo", base64);
    } catch (err) {
      setError("Failed to process photo upload.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed: HRAdminProfile = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      profile_photo: formData.profile_photo,
      mobile_number: formData.mobile_number.trim(),
      designation: formData.designation.trim(),
      preferred_language: formData.preferred_language,
    };

    if (!trimmed.first_name) return setError("First Name is required.");
    if (!trimmed.last_name) return setError("Last Name is required.");
    if (!trimmed.mobile_number) return setError("Mobile Number is required.");
    if (!validateMobileNumber(trimmed.mobile_number)) {
      return setError("Invalid Mobile Number. Please enter a valid 10-digit number or international format (e.g. +919876543210).");
    }
    if (!trimmed.designation) return setError("Designation is required.");

    onSave(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Photo Uploader */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-5 rounded-2xl bg-card border border-border/80">
        <div className="relative">
          {formData.profile_photo ? (
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-md">
              <img src={formData.profile_photo} alt="Profile Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => handleChange("profile_photo", "")}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-background/90 text-destructive flex items-center justify-center border border-border shadow-xs hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-primary/10 border-2 border-dashed border-primary/30 flex flex-col items-center justify-center text-primary gap-1">
              <Camera className="w-6 h-6" />
              <span className="text-[10px] font-semibold">Photo</span>
            </div>
          )}
        </div>

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <h4 className="text-sm font-bold text-foreground">HR Admin Profile Photo</h4>
          <p className="text-xs text-muted-foreground">Upload a professional avatar. JPG, PNG or WebP up to 3MB.</p>
          <div className="pt-2">
            <Label htmlFor="photo-upload-input" className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{formData.profile_photo ? "Change Photo" : "Upload Photo"}</span>
            </Label>
            <input
              id="photo-upload-input"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="e.g. Alex"
            value={formData.first_name}
            onChange={(e) => handleChange("first_name", e.target.value)}
            className="text-xs h-10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="e.g. Mercer"
            value={formData.last_name}
            onChange={(e) => handleChange("last_name", e.target.value)}
            className="text-xs h-10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">
            Mobile Number <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="e.g. +91 98765 43210"
            value={formData.mobile_number}
            onChange={(e) => handleChange("mobile_number", e.target.value)}
            className="text-xs h-10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">
            Designation <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="e.g. Chief HR Officer / HR Administrator"
            value={formData.designation}
            onChange={(e) => handleChange("designation", e.target.value)}
            className="text-xs h-10 rounded-xl"
            required
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs font-medium">
            Preferred Interface Language <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.preferred_language} onValueChange={(val) => handleChange("preferred_language", val)}>
            <SelectTrigger className="text-xs h-10 rounded-xl">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="English" className="text-xs">English</SelectItem>
              <SelectItem value="Hindi" className="text-xs">Hindi (हिंदी)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={isLoading} className="rounded-xl px-5 text-xs">
          Back
        </Button>
        <Button type="submit" disabled={isLoading} className="rounded-xl px-6 text-xs gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <>
              <span>Save & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
