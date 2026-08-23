import { createContext, useContext, ReactNode } from "react";
import { PayrollContextType } from "./contextType";
import { useComposePayroll } from "./hooks/useComposePayroll";

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

export function PayrollProvider({ children }: { children: ReactNode }) {
  const value = useComposePayroll();
  return <PayrollContext.Provider value={value}>{children}</PayrollContext.Provider>;
}

export const usePayrollContext = () => {
  const ctx = useContext(PayrollContext);
  if (!ctx) throw new Error("usePayrollContext must be used within a PayrollProvider");
  return ctx;
};
