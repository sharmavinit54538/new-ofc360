import { useState, useEffect } from "react";
import { OnboardingPreferences } from "@/types/hrAdminOnboarding";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sliders, Clock, Calendar, Bell, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

interface StepPreferencesProps {
  initialData: OnboardingPreferences;
  onSave: (data: OnboardingPreferences) => Promise<void> | void;
  onBack: () => void;
  isLoading?: boolean;
}

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const ALL_CHANNELS = ["Email", "In-App", "WhatsApp", "Slack"];

export function StepPreferences({ initialData, onSave, onBack, isLoading }: StepPreferencesProps) {
  const [formData, setFormData] = useState<OnboardingPreferences>(initialData);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        work_days: initialData.work_days || prev.work_days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        work_hours: initialData.work_hours || prev.work_hours || "09:00 - 18:00",
        attendance_telemetry: initialData.attendance_telemetry || prev.attendance_telemetry || "Face + Web Check-in",
        payroll_cycle_start: initialData.payroll_cycle_start ?? prev.payroll_cycle_start ?? 1,
        notification_channels: initialData.notification_channels || prev.notification_channels || ["Email", "In-App"],
      }));
    }
  }, [initialData]);

  const toggleDay = (day: string) => {
    const exists = formData.work_days.includes(day);
    const updated = exists
      ? formData.work_days.filter((d) => d !== day)
      : [...formData.work_days, day];
    setFormData((prev) => ({ ...prev, work_days: updated }));
  };

  const toggleChannel = (ch: string) => {
    const exists = formData.notification_channels.includes(ch);
    const updated = exists
      ? formData.notification_channels.filter((c) => c !== ch)
      : [...formData.notification_channels, ch];
    setFormData((prev) => ({ ...prev, notification_channels: updated }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Working Days */}
      <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/60 pb-2">
          <Calendar className="w-4 h-4 text-primary" />
          <span>Standard Work Week</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {ALL_DAYS.map((day) => {
            const selected = formData.work_days.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  selected
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Work Hours & Attendance Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/60 pb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>Standard Working Hours</span>
          </div>
          <Select
            value={formData.work_hours}
            onValueChange={(val) => setFormData((prev) => ({ ...prev, work_hours: val }))}
          >
            <SelectTrigger className="text-xs h-10 rounded-xl">
              <SelectValue placeholder="Select Hours" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="09:00 - 18:00" className="text-xs">09:00 AM - 06:00 PM (Standard 9h)</SelectItem>
              <SelectItem value="08:30 - 17:30" className="text-xs">08:30 AM - 05:30 PM</SelectItem>
              <SelectItem value="10:00 - 19:00" className="text-xs">10:00 AM - 07:00 PM</SelectItem>
              <SelectItem value="Flexible Shifts" className="text-xs">Flexible Shift Rotations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/60 pb-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Attendance Telemetry Mode</span>
          </div>
          <Select
            value={formData.attendance_telemetry}
            onValueChange={(val) => setFormData((prev) => ({ ...prev, attendance_telemetry: val }))}
          >
            <SelectTrigger className="text-xs h-10 rounded-xl">
              <SelectValue placeholder="Select Attendance Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Face + Web Check-in" className="text-xs">Face Attendance + Web Portal</SelectItem>
              <SelectItem value="CCTV AI Recognition" className="text-xs">AI CCTV Automated Recognition</SelectItem>
              <SelectItem value="Geo-Fenced Mobile App" className="text-xs">Geo-Fenced Mobile Punching</SelectItem>
              <SelectItem value="Manual HR Logging" className="text-xs">Manual Timesheets & Manager Approvals</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notification Channels */}
      <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/60 pb-2">
          <Bell className="w-4 h-4 text-primary" />
          <span>Default HR Notification Channels</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {ALL_CHANNELS.map((ch) => {
            const checked = formData.notification_channels.includes(ch);
            return (
              <label
                key={ch}
                onClick={() => toggleChannel(ch)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  checked
                    ? "bg-primary/10 border-primary/30 text-foreground font-semibold"
                    : "bg-secondary/20 border-border text-muted-foreground"
                }`}
              >
                <Checkbox checked={checked} onCheckedChange={() => {}} />
                <span>{ch}</span>
              </label>
            );
          })}
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
              <span>Saving Preferences...</span>
            </>
          ) : (
            <>
              <span>Save & Review</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}