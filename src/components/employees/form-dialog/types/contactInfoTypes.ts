export interface ContactInfoState {
  personalEmail: string;
  setPersonalEmail: (v: string) => void;
  companyWorkEmail: string;
  setCompanyWorkEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  alternatePhone: string;
  setAlternatePhone: (v: string) => void;
}
