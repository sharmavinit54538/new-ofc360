import { useState } from "react";

export function usePayrollForms3() {
  const [advEmp, setAdvEmp] = useState("");
  const [advAmount, setAdvAmount] = useState("");
  const [advEmi, setAdvEmi] = useState("6");
  const [taxRegime, setTaxRegime] = useState("New Tax Regime (Sec 115BAC)");
  const [tax80C, setTax80C] = useState("150000");
  const [tax80D, setTax80D] = useState("25000");
  return {
    advEmp, setAdvEmp, advAmount, setAdvAmount, advEmi, setAdvEmi,
    taxRegime, setTaxRegime, tax80C, setTax80C, tax80D, setTax80D,
  };
}
