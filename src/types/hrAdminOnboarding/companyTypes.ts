export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "501-1000" | "1000+" | string;

export interface CompanyDetails {
  company_name: string;
  industry: string;
  country: string;
  city: string;
  company_size: CompanySize | string;
  timezone: string;
  address?: string;
  tax_id?: string;
  pan_number?: string;
  gst_number?: string;
  website?: string;
  [key: string]: any;
}
