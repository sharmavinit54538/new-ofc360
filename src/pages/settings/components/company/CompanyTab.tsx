import { TabsContent } from "@/components/ui/tabs";
import { useCompanySettings } from "../../hooks/useCompanySettings";
import { CompanyFormHeader } from "./CompanyFormHeader";
import { CompanyIdentityFields } from "./CompanyIdentityFields";
import { CompanyContactFields } from "./CompanyContactFields";
import { CompanyLocationFields } from "./CompanyLocationFields";

export function CompanyTab() {
  const { companyData, setCompanyData, handleSaveCompany } = useCompanySettings();
  return (
    <TabsContent value="company">
      <form onSubmit={handleSaveCompany} className="glass-card rounded-2xl p-6 border border-border/50 bg-card space-y-6 shadow-sm">
        <CompanyFormHeader />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <CompanyIdentityFields data={companyData} onChange={setCompanyData} />
          <CompanyContactFields data={companyData} onChange={setCompanyData} />
          <CompanyLocationFields data={companyData} onChange={setCompanyData} />
        </div>
      </form>
    </TabsContent>
  );
}
