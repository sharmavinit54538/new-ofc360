import { useState } from "react";
import type { CompensationState } from "../types/compensationTypes";

export function useCompensationState(): CompensationState {
  const [ctc, setCtc] = useState(1200000);
  const [basicSalary, setBasicSalary] = useState(600000);
  const [hra, setHra] = useState(300000);
  const [bonus, setBonus] = useState(180000);
  const [pfDeduction, setPfDeduction] = useState(72000);
  const [esiDeduction, setEsiDeduction] = useState(0);
  const [profTax, setProfTax] = useState(2500);

  return { ctc, setCtc, basicSalary, setBasicSalary, hra, setHra, bonus, setBonus, pfDeduction, setPfDeduction, esiDeduction, setEsiDeduction, profTax, setProfTax };
}
