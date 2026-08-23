import { useState } from "react";
import { CompanyDetails, HRAdminProfile, CompanyBranding, OnboardingPreferences } from "@/types/hrAdminOnboarding";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User, Stamp, Sliders, CheckCircle2, Edit3, ArrowRight, ShieldCheck, Sparkles, Loader2 } from "lucide-react";

interface StepReviewProps {
  company: CompanyDetails;
  hrAdmin: HRAdminProfile;
  branding: CompanyBranding;
  preferences: OnboardingPreferences;
  onEditStep: (stepIndex: number) => void;
  onComplete: () => Promise<void> | void;
  onBack: () => void;
  isLoading?: boolean;
}

export function StepReview({
  company,
  hrAdmin,
  branding,
  preferences,
  onEditStep,
  onComplete,
  onBack,
  isLoading,
}: StepReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWorking = isSubmitting || isLoading;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary">
          <Sparkles className="w-4 h-4" />
          <span>Please review all details before completing your organization setup.</span>
        </div>
      </div>

      {/* 1. Company Information */}
      <Card className="glass-card border border-border/80 rounded-2xl p-5 space-y-3 bg-card">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <span>Company Details</span>
          </h4>
          <Button variant="ghost" size="sm" onClick={() => onEditStep(1)} disabled={isWorking} className="h-7 text-xs gap-1 text-primary hover:text-primary/80">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px]">Company Name</span>
            <span className="font-semibold text-foreground">{company.company_name || "N/A"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Industry</span>
            <span className="font-semibold text-foreground">{company.industry || "N/A"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Company Size</span>
            <span className="font-semibold text-foreground">{company.company_size ? `${company.company_size} employees` : "N/A"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Country & City</span>
            <span className="font-semibold text-foreground">{company.city}, {company.country}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Timezone</span>
            <span className="font-semibold text-foreground">{company.timezone}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Official Email</span>
            <span className="font-semibold text-foreground">{company.official_email || "None"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Official Phone</span>
            <span className="font-semibold text-foreground">{company.official_phone || "None"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Website</span>
            <span className="font-semibold text-foreground truncate block">{company.website || "None"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">CIN</span>
            <span className="font-mono text-foreground">{company.cin_number || "None"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">GSTIN</span>
            <span className="font-mono text-foreground">{company.gst_number || "None"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">PAN</span>
            <span className="font-mono text-foreground">{company.pan_number || "None"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">TAN</span>
            <span className="font-mono text-foreground">{company.tan_number || "None"}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground block text-[10px]">MSME Registration</span>
            <span className="font-semibold text-foreground">{company.msme_registration_number || "None"}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground block text-[10px]">Registered Address</span>
            <span className="font-semibold text-foreground">{company.address || "None"}</span>
          </div>
        </div>
      </Card>

      {/* 2. HR Admin Profile */}
      <Card className="glass-card border border-border/80 rounded-2xl p-5 space-y-3 bg-card">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            <span>HR Admin Profile</span>
          </h4>
          <Button variant="ghost" size="sm" onClick={() => onEditStep(2)} disabled={isWorking} className="h-7 text-xs gap-1 text-primary hover:text-primary/80">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px]">Full Name</span>
            <span className="font-semibold text-foreground">{hrAdmin.first_name} {hrAdmin.last_name}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Mobile Number</span>
            <span className="font-semibold text-foreground">{hrAdmin.mobile_number}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Designation</span>
            <span className="font-semibold text-foreground">{hrAdmin.designation}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Language</span>
            <span className="font-semibold text-foreground">{hrAdmin.preferred_language}</span>
          </div>
        </div>
      </Card>

      {/* 3. Company Branding & Stamp */}
      <Card className="glass-card border border-border/80 rounded-2xl p-5 space-y-3 bg-card">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Stamp className="w-4 h-4 text-primary" />
            <span>Branding & Stamp</span>
          </h4>
          <Button variant="ghost" size="sm" onClick={() => onEditStep(3)} disabled={isWorking} className="h-7 text-xs gap-1 text-primary hover:text-primary/80">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-center">
          <div>
            <span className="text-muted-foreground block text-[10px] mb-1">Company Stamp</span>
            {branding.company_stamp ? (
              <div className="w-24 h-16 rounded-lg border border-border p-1 bg-secondary/20 flex items-center justify-center">
                <img src={branding.company_stamp} alt="Stamp" className="max-h-full max-w-full object-contain" />
              </div>
            ) : (
              <span className="text-muted-foreground italic">Not Uploaded</span>
            )}
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Authorized Signatory</span>
            <span className="font-semibold text-foreground">{branding.authorized_signatory_name || "N/A"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Signatory Designation</span>
            <span className="font-semibold text-foreground">{branding.authorized_signatory_designation || "N/A"}</span>
          </div>
        </div>
      </Card>

      {/* 4. Preferences */}
      <Card className="glass-card border border-border/80 rounded-2xl p-5 space-y-3 bg-card">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary" />
            <span>Onboarding Preferences</span>
          </h4>
          <Button variant="ghost" size="sm" onClick={() => onEditStep(4)} disabled={isWorking} className="h-7 text-xs gap-1 text-primary hover:text-primary/80">
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px]">Working Days</span>
            <span className="font-semibold text-foreground">{preferences.work_days?.join(", ") || "Mon - Fri"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Work Hours</span>
            <span className="font-semibold text-foreground">{preferences.work_hours || "09:00 - 18:00"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Attendance Telemetry</span>
            <span className="font-semibold text-foreground">{preferences.attendance_telemetry || "Face + Web Check-in"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Payroll Cycle Day</span>
            <span className="font-semibold text-foreground">{preferences.payroll_cycle_start ?? 1}</span>
          </div>
          <div className="col-span-2">
            <span className="text-muted-foreground block text-[10px]">Notification Channels</span>
            <span className="font-semibold text-foreground">{preferences.notification_channels?.join(", ") || "Email, In-App"}</span>
          </div>
        </div>
      </Card>

      <div className="pt-4 flex items-center justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={isWorking} className="rounded-xl px-5 text-xs">
          Back
        </Button>
        <Button
          type="button"
          onClick={handleFinalSubmit}
          disabled={isWorking}
          className="rounded-xl px-7 text-xs gap-2 bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90"
        >
          {isWorking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Setup...</span>
            </>
          ) : (
            <>
              <span>Complete HR Admin Setup</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}