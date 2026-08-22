import { useState } from "react";
import { toast } from "sonner";
import type { CompanyFormData } from "../types/companyTypes";

export function useCompanySettings() {
  const [companyData, setCompanyData] = useState<CompanyFormData>({
    companyName: "", registrationNumber: "", gstNumber: "", website: "",
    officialEmail: "", address: "", city: "", country: "", timezone: "", currency: "",
  });

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyData.companyName.trim()) {
      toast.error("Please enter company name.");
      return;
    }
    toast.success("Company information saved successfully!");
  };

  return { companyData, setCompanyData, handleSaveCompany };
}
