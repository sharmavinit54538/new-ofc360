import React from "react";
import { Button } from "@/components/ui/button";
interface PayslipDownloadButtonProps { payslipId: string; }
export const PayslipDownloadButton: React.FC<PayslipDownloadButtonProps> = ({ payslipId }) => {
  return <Button className="text-xs h-8">Download Payslip {payslipId}</Button>;
};
export default PayslipDownloadButton;