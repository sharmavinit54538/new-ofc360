export interface HRDocument {
  id: string;
  title: string;
  type: 'contract' | 'offer_letter' | 'policy' | 'certificate' | 'payslip' | 'tax_doc';
  employeeId?: string;
  fileUrl: string;
  uploadedAt: string;
  signatureStatus?: 'not_required' | 'pending' | 'signed' | 'rejected';
}
