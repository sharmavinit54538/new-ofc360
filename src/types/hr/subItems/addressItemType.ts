export interface AddressItem {
  id?: string;
  type: "permanent" | "current" | "PRESENT" | "PERMANENT" | string;
  street?: string;
  line1?: string;
  city: string;
  state: string;
  zip?: string;
  pincode?: string;
  country: string;
  [key: string]: any;
}
