import { useState, useEffect } from "react";
import { CompanyDetails, CompanySize } from "@/types/hrAdminOnboarding";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, FileCheck2, Phone, Globe, Mail, ArrowRight, AlertCircle } from "lucide-react";
import {
  validateCIN,
  validateGSTIN,
  validatePAN,
  validateTAN,
} from "@/utils/onboardingValidation";

import { Loader2 } from "lucide-react";

interface StepCompanyDetailsProps {
  initialData: CompanyDetails;
  onSave: (data: CompanyDetails) => Promise<void> | void;
  isLoading?: boolean;
}

const INDUSTRY_OPTIONS = [
  "Information Technology & Services",
  "Software Development & SaaS",
  "Banking & Financial Services",
  "Healthcare & Life Sciences",
  "E-Commerce & Retail",
  "Manufacturing & Logistics",
  "Telecommunications",
  "Education & EdTech",
  "Consulting & Professional Services",
  "Media & Entertainment",
];

const COMPANY_SIZE_OPTIONS: CompanySize[] = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5000+",
];

const COUNTRY_OPTIONS = [
  "India",
  "United States",
  "United Kingdom",
  "Singapore",
  "United Arab Emirates",
  "Germany",
  "Canada",
  "Australia",
];

const CITY_OPTIONS: Record<string, string[]> = {
  India: ["Mumbai", "Bengaluru", "Hyderabad", "Delhi NCR", "Pune", "Chennai", "Kolkata", "Ahmedabad"],
  "United States": ["San Francisco", "New York", "Austin", "Seattle", "Chicago"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Edinburgh"],
  Singapore: ["Singapore Central", "Jurong East", "Changi"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi", "Sharjah"],
  Canada: ["Toronto", "Vancouver", "Montreal"],
};

const TIMEZONE_OPTIONS = [
  "Asia/Kolkata",
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Asia/Singapore",
  "Asia/Dubai",
];

export function StepCompanyDetails({ initialData, onSave, isLoading }: StepCompanyDetailsProps) {
  const [formData, setFormData] = useState<CompanyDetails>(initialData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        company_name: initialData.company_name || prev.company_name || "",
        industry: initialData.industry || prev.industry || "",
        country: initialData.country || prev.country || "India",
        city: initialData.city || prev.city || "",
        company_size: initialData.company_size || prev.company_size || "",
        timezone: initialData.timezone || prev.timezone || "Asia/Kolkata",
        address: initialData.address || prev.address || "",
        cin_number: initialData.cin_number !== undefined ? initialData.cin_number : prev.cin_number,
        gst_number: initialData.gst_number !== undefined ? initialData.gst_number : prev.gst_number,
        pan_number: initialData.pan_number !== undefined ? initialData.pan_number : prev.pan_number,
        tan_number: initialData.tan_number !== undefined ? initialData.tan_number : prev.tan_number,
        msme_registration_number: initialData.msme_registration_number !== undefined ? initialData.msme_registration_number : prev.msme_registration_number,
        website: initialData.website !== undefined ? initialData.website : prev.website,
        official_email: initialData.official_email !== undefined ? initialData.official_email : prev.official_email,
        official_phone: initialData.official_phone !== undefined ? initialData.official_phone : prev.official_phone,
      }));
    }
  }, [initialData]);

  const availableCities = CITY_OPTIONS[formData.country] || ["Capital City", "Regional Metro", "Other"];

  const handleChange = (field: keyof CompanyDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Trim validation
    const trimmed: CompanyDetails = {
      company_name: formData.company_name.trim(),
      industry: formData.industry.trim(),
      country: formData.country.trim(),
      city: formData.city.trim(),
      company_size: formData.company_size,
      timezone: formData.timezone.trim(),
      address: formData.address.trim(),
      cin_number: formData.cin_number?.trim(),
      gst_number: formData.gst_number?.trim(),
      pan_number: formData.pan_number?.trim(),
      tan_number: formData.tan_number?.trim(),
      msme_registration_number: formData.msme_registration_number?.trim(),
      website: formData.website?.trim(),
      official_email: formData.official_email?.trim(),
      official_phone: formData.official_phone?.trim(),
    };

    if (!trimmed.company_name) return setError("Company Name is required.");
    if (!trimmed.industry) return setError("Industry is required.");
    if (!trimmed.country) return setError("Country is required.");
    if (!trimmed.city) return setError("City is required.");
    if (!trimmed.company_size) return setError("Company Size is required.");
    if (!trimmed.timezone) return setError("Timezone is required.");
    if (!trimmed.address) return setError("Address is required.");

    // Pattern validations
    if (!validateCIN(trimmed.cin_number)) {
      return setError("Invalid CIN format. Example: U12345MH2020PTC123456");
    }
    if (!validateGSTIN(trimmed.gst_number)) {
      return setError("Invalid GSTIN format. Example: 22AAAAA0000A1Z5");
    }
    if (!validatePAN(trimmed.pan_number)) {
      return setError("Invalid PAN format. Example: ABCDE1234F");
    }
    if (!validateTAN(trimmed.tan_number)) {
      return setError("Invalid TAN format. Example: ABCD12345E");
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

      {/* SECTION 1: Company Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/60 pb-2">
          <Building2 className="w-4 h-4 text-primary" />
          <span>Company Information</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium">
              Company Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. EquinoxSphere Technologies Pvt Ltd"
              value={formData.company_name}
              onChange={(e) => handleChange("company_name", e.target.value)}
              className="text-xs h-10 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Industry <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.industry} onValueChange={(val) => handleChange("industry", val)}>
              <SelectTrigger className="text-xs h-10 rounded-xl">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRY_OPTIONS.map((ind) => (
                  <SelectItem key={ind} value={ind} className="text-xs">
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Company Size <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.company_size} onValueChange={(val) => handleChange("company_size", val as CompanySize)}>
              <SelectTrigger className="text-xs h-10 rounded-xl">
                <SelectValue placeholder="Select Employee Count" />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_SIZE_OPTIONS.map((sz) => (
                  <SelectItem key={sz} value={sz} className="text-xs">
                    {sz} employees
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* SECTION 2: Location */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/60 pb-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span>Location & Timezone</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Country <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.country} onValueChange={(val) => handleChange("country", val)}>
              <SelectTrigger className="text-xs h-10 rounded-xl">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              City <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.city} onValueChange={(val) => handleChange("city", val)}>
              <SelectTrigger className="text-xs h-10 rounded-xl">
                <SelectValue placeholder="Select City" />
              </SelectTrigger>
              <SelectContent>
                {availableCities.map((ct) => (
                  <SelectItem key={ct} value={ct} className="text-xs">
                    {ct}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">
              Timezone <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.timezone} onValueChange={(val) => handleChange("timezone", val)}>
              <SelectTrigger className="text-xs h-10 rounded-xl">
                <SelectValue placeholder="Select Timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONE_OPTIONS.map((tz) => (
                  <SelectItem key={tz} value={tz} className="text-xs">
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-3">
            <Label className="text-xs font-medium">
              Registered Office Address <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Building/Floor, Street Name, Tech Park, Postal Code"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="text-xs rounded-xl min-h-[70px]"
              required
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Business Registration (Optional) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/60 pb-2">
          <FileCheck2 className="w-4 h-4 text-primary" />
          <span>Business Registration & Tax Identifiers (Optional)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">CIN Number</Label>
            <Input
              placeholder="e.g. U72200MH2024PTC123456"
              value={formData.cin_number || ""}
              onChange={(e) => handleChange("cin_number", e.target.value.toUpperCase())}
              className="text-xs h-10 rounded-xl font-mono uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">GSTIN Number</Label>
            <Input
              placeholder="e.g. 27AAAAA0000A1Z5"
              value={formData.gst_number || ""}
              onChange={(e) => handleChange("gst_number", e.target.value.toUpperCase())}
              className="text-xs h-10 rounded-xl font-mono uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">PAN Number</Label>
            <Input
              placeholder="e.g. ABCDE1234F"
              value={formData.pan_number || ""}
              onChange={(e) => handleChange("pan_number", e.target.value.toUpperCase())}
              className="text-xs h-10 rounded-xl font-mono uppercase"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">TAN Number</Label>
            <Input
              placeholder="e.g. MUMB12345E"
              value={formData.tan_number || ""}
              onChange={(e) => handleChange("tan_number", e.target.value.toUpperCase())}
              className="text-xs h-10 rounded-xl font-mono uppercase"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium">MSME Registration Number</Label>
            <Input
              placeholder="e.g. UDYAM-MH-01-0000000"
              value={formData.msme_registration_number || ""}
              onChange={(e) => handleChange("msme_registration_number", e.target.value)}
              className="text-xs h-10 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* SECTION 4: Official Contact */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground border-b border-border/60 pb-2">
          <Globe className="w-4 h-4 text-primary" />
          <span>Official Contacts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Official Email</Label>
            <Input
              type="email"
              placeholder="contact@company.com"
              value={formData.official_email || ""}
              onChange={(e) => handleChange("official_email", e.target.value)}
              className="text-xs h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Official Phone</Label>
            <Input
              placeholder="+91 22 1234 5678"
              value={formData.official_phone || ""}
              onChange={(e) => handleChange("official_phone", e.target.value)}
              className="text-xs h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Website</Label>
            <Input
              placeholder="https://www.company.com"
              value={formData.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              className="text-xs h-10 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={isLoading} className="rounded-xl px-6 text-xs gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Company Details...</span>
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