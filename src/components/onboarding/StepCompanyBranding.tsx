import { useState, useEffect } from "react";
import { CompanyBranding } from "@/types/hrAdminOnboarding";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, ArrowRight, AlertCircle, Stamp, Image, UserCheck, ShieldCheck, Loader2 } from "lucide-react";
import { validateImageFile, fileToBase64 } from "@/utils/onboardingValidation";

interface StepCompanyBrandingProps {
  initialData: CompanyBranding;
  onSave: (data: CompanyBranding) => Promise<void> | void;
  onBack: () => void;
  isLoading?: boolean;
}

export function StepCompanyBranding({ initialData, onSave, onBack, isLoading }: StepCompanyBrandingProps) {
  const [formData, setFormData] = useState<CompanyBranding>(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        company_logo: initialData.company_logo !== undefined ? initialData.company_logo : prev.company_logo,
        company_stamp: initialData.company_stamp !== undefined ? initialData.company_stamp : prev.company_stamp,
        authorized_signatory_name: initialData.authorized_signatory_name || prev.authorized_signatory_name || "",
        authorized_signatory_designation: initialData.authorized_signatory_designation || prev.authorized_signatory_designation || "",
        letterhead: initialData.letterhead !== undefined ? initialData.letterhead : prev.letterhead,
      }));
    }
  }, [initialData]);

  const handleChange = (field: keyof CompanyBranding, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "company_logo" | "company_stamp" | "letterhead"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file, ["image/jpeg", "image/png", "image/webp"], 5 * 1024 * 1024);
    if (!validation.valid) {
      setError(validation.error || "Invalid file");
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      handleChange(field, base64);
    } catch (err) {
      setError("Failed to upload image file.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed: CompanyBranding = {
      company_logo: formData.company_logo,
      company_stamp: formData.company_stamp,
      authorized_signatory_name: formData.authorized_signatory_name.trim(),
      authorized_signatory_designation: formData.authorized_signatory_designation.trim(),
      letterhead: formData.letterhead,
    };

    if (!trimmed.authorized_signatory_name) {
      return setError("Authorized Signatory Name is required.");
    }
    if (!trimmed.authorized_signatory_designation) {
      return setError("Authorized Signatory Designation is required.");
    }

    onSave(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Company Logo Card */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3 flex flex-col justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Image className="w-4 h-4 text-primary" />
                <span>Company Logo</span>
              </h4>
              <Badge variant="outline" className="text-[10px]">PNG / JPG</Badge>
            </div>
            <p className="text-xs text-muted-foreground">Appears in header, navbar, and employee portal.</p>
          </div>

          <div className="pt-2 flex flex-col items-center justify-center">
            {formData.company_logo ? (
              <div className="relative w-full h-32 rounded-xl border border-border overflow-hidden flex items-center justify-center p-2 bg-secondary/30">
                <img src={formData.company_logo} alt="Company Logo" className="max-h-full max-w-full object-contain" />
                <button
                  type="button"
                  onClick={() => handleChange("company_logo", "")}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/90 text-destructive flex items-center justify-center border border-border shadow-xs hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Label htmlFor="logo-upload-input" className="w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors space-y-1 bg-secondary/10">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">Upload Logo</span>
                <span className="text-[10px] text-muted-foreground">Max size: 5MB</span>
              </Label>
            )}
            <input
              id="logo-upload-input"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => handleFileUpload(e, "company_logo")}
              className="hidden"
            />
          </div>
        </div>

        {/* Company Official Stamp / Seal Card (CRITICAL) */}
        <div className="p-5 rounded-2xl bg-card border-2 border-primary/30 space-y-3 flex flex-col justify-between shadow-xs">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Stamp className="w-4 h-4 text-primary" />
                <span>Official Company Stamp / Seal</span>
              </h4>
              <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/20 text-primary font-semibold">
                Transparent PNG Recommended
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Used automatically for embedding on Offer Letters, Appointment Letters, Experience Certificates, and digital HR documents.
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center justify-center">
            {formData.company_stamp ? (
              <div className="relative w-full h-32 rounded-xl border border-primary/40 overflow-hidden flex items-center justify-center p-2 bg-primary/5">
                <img src={formData.company_stamp} alt="Company Stamp" className="max-h-full max-w-full object-contain" />
                <button
                  type="button"
                  onClick={() => handleChange("company_stamp", "")}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-background/90 text-destructive flex items-center justify-center border border-border shadow-xs hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Label htmlFor="stamp-upload-input" className="w-full h-32 rounded-xl border-2 border-dashed border-primary/40 hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors space-y-1 bg-primary/5">
                <Stamp className="w-6 h-6 text-primary" />
                <span className="text-xs font-bold text-foreground">[ Upload Company Stamp ]</span>
                <span className="text-[10px] text-muted-foreground">PNG / JPG up to 5MB</span>
              </Label>
            )}
            <input
              id="stamp-upload-input"
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={(e) => handleFileUpload(e, "company_stamp")}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Authorized Signatory Details */}
      <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/60 pb-2">
          <UserCheck className="w-4 h-4 text-primary" />
          <span>Authorized Signatory Details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Authorized Signatory Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Vinit Sharma"
              value={formData.authorized_signatory_name}
              onChange={(e) => handleChange("authorized_signatory_name", e.target.value)}
              className="text-xs h-10 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Authorized Signatory Designation <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Managing Director / Founder"
              value={formData.authorized_signatory_designation}
              onChange={(e) => handleChange("authorized_signatory_designation", e.target.value)}
              className="text-xs h-10 rounded-xl"
              required
            />
          </div>
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
              <span>Saving Branding...</span>
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
