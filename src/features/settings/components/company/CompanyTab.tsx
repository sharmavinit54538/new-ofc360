import { TabsContent } from "@/components/ui/tabs";
import { useCompanySettings } from "../../hooks/useCompanySettings";
import { CompanyFormHeader } from "./CompanyFormHeader";
import { CompanyFormBody } from "./CompanyFormBody";

export function CompanyTab() {
  const { companyData, setCompanyData, handleSaveCompany, isSavingCompany, isLoadingCompany } = useCompanySettings();
  return (
    <TabsContent value="company">
      <form onSubmit={handleSaveCompany} className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-6 shadow-sm">
        <CompanyFormHeader isSaving={isSavingCompany} isLoading={isLoadingCompany} />
        <CompanyFormBody data={companyData} onChange={setCompanyData} />
      </form>
    </TabsContent>
  );
}