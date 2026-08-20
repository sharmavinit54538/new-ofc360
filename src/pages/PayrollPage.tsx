import { PayrollProvider } from "@/components/payroll/PayrollContext";
import { PayrollDashboard } from "@/components/payroll/PayrollDashboard";

export default function PayrollPage() {
  return (
    <PayrollProvider>
      <PayrollDashboard />
    </PayrollProvider>
  );
}