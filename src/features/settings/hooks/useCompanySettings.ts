import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useGetCompanyQuery, useUpdateCompanyMutation } from "@/features/company/api/company.api";
import { useAuth } from "@/hooks/useAuth";
import { normalizeError } from "@/services/api/normalizeError";
import type { CompanyFormData } from "../types/types/companyTypes";

export function useCompanySettings() {
  const { user } = useAuth();
  const { data: company, isLoading: isLoadingCompany, refetch: refetchCompany } = useGetCompanyQuery();
  const [updateCompany, { isLoading: isSavingCompany }] = useUpdateCompanyMutation();

  const [companyData, setCompanyData] = useState<CompanyFormData>({
    companyName: "",
    registrationNumber: "",
    gstNumber: "",
    website: "",
    officialEmail: "",
    address: "",
    city: "",
    country: "India",
    timezone: "Asia/Kolkata",
    currency: "INR",
  });

  useEffect(() => {
    if (company) {
      setCompanyData({
        companyName: company.name || company.legal_name || (user as any)?.companyName || "",
        registrationNumber: company.registration_number || "",
        gstNumber: company.tax_id || "",
        website: company.website || "",
        officialEmail: company.email || "",
        address: company.address || "",
        city: company.city || "",
        country: company.country || "India",
        timezone: (company as any).timezone || "Asia/Kolkata",
        currency: (company as any).currency || "INR",
      });
    } else if (user) {
      setCompanyData((prev) => ({
        ...prev,
        companyName: (user as any)?.companyName || (user as any)?.company?.name || prev.companyName,
        officialEmail: user.email || prev.officialEmail,
      }));
    }
  }, [company, user]);

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData.companyName.trim()) {
      return toast.error("Please enter company name.");
    }

    try {
      await updateCompany({
        name: companyData.companyName.trim(),
        legal_name: companyData.companyName.trim(),
        registration_number: companyData.registrationNumber.trim(),
        tax_id: companyData.gstNumber.trim(),
        website: companyData.website.trim(),
        email: companyData.officialEmail.trim(),
        address: companyData.address.trim(),
        city: companyData.city.trim(),
        country: companyData.country.trim(),
      }).unwrap();

      toast.success("Company information saved successfully to database!");
    } catch (err: any) {
      toast.error(normalizeError(err).message || "Failed to save company information.");
    }
  };

  return {
    companyData,
    setCompanyData,
    isLoadingCompany,
    isSavingCompany,
    refetchCompany,
    handleSaveCompany,
  };
}