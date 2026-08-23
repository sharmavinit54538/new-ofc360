import { TabsContent } from "@/components/ui/tabs";
import { CompanyRosterFilters } from "./CompanyRosterFilters";
import { CompanyRosterTable } from "./CompanyRosterTable";
import { CompanyRosterPagination } from "./CompanyRosterPagination";

export function CompanyRosterTab({ comp }: { comp: any }) {
  return (
    <TabsContent value="company" className="space-y-4">
      <CompanyRosterFilters search={comp.companySearch} setSearch={(s: string) => { comp.setCompanySearch(s); comp.setCompanyPage(1); }} dept={comp.companyDept} setDept={(d: string) => { comp.setCompanyDept(d); comp.setCompanyPage(1); }} date={comp.companyDate} setDate={(dt: string) => { comp.setCompanyDate(dt); comp.setCompanyPage(1); }} status={comp.companyStatus} setStatus={(st: string) => { comp.setCompanyStatus(st); comp.setCompanyPage(1); }} total={comp.data?.total} />
      <div className="space-y-0">
        <CompanyRosterTable isLoading={comp.isLoading} items={comp.data?.items} />
        <CompanyRosterPagination page={comp.data?.page} totalPages={comp.data?.totalPages} setPage={comp.setCompanyPage} />
      </div>
    </TabsContent>
  );
}
