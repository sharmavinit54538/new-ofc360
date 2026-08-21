export interface KycDocumentItem {
  id?: string;
  type: "aadhaar" | "pan" | "passport" | "voter_id" | "driving_license" | "AADHAAR" | "PAN" | string;
  docNumber?: string;
  documentNumber?: string;
  documentUrl?: string;
  verified?: boolean;
  expiryDate?: string;
  [key: string]: any;
}
