import { useState } from "react";
import { toast } from "sonner";
import type { CompanyFormData } from "../types/companyTypes";

export function useCompanySettings() {
  const [companyData, setCompanyData] = useState<CompanyFormData>({
    companyName: "", registrationNumber: "", gstNumber: "", website: "", officialEmail: "", address: "", city: "", country: "", timezone: "", currency: "",
  });

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData.companyName.trim()) return toast.error("Please enter company name.");
    toast.success("Company information saved successfully!");
  };

  return { companyData, setCompanyData, handleSaveCompany };
}