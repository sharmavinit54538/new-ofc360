import type { CompanyFormData } from "../../types/companyTypes";
import { CompanyIdentityFields } from "./CompanyIdentityFields";
import { CompanyContactFields } from "./CompanyContactFields";
import { CompanyLocationFields } from "./CompanyLocationFields";

export function CompanyFormBody({ data, onChange }: { data: CompanyFormData; onChange: (d: CompanyFormData) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <CompanyIdentityFields data={data} onChange={onChange} />
      <CompanyContactFields data={data} onChange={onChange} />
      <CompanyLocationFields data={data} onChange={onChange} />
    </div>
  );
}