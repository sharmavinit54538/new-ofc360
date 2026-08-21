export interface HRAdminProfile {
  first_name: string;
  last_name: string;
  mobile_number: string;
  designation: string;
  preferred_language?: string;
  department?: string;
  email?: string;
  [key: string]: any;
}
