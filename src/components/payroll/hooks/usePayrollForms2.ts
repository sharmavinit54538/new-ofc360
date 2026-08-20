import { useState } from "react";

export function usePayrollForms2() {
  const [bonusEmp, setBonusEmp] = useState("");
  const [bonusType, setBonusType] = useState("Performance Bonus");
  const [bonusAmount, setBonusAmount] = useState("");
  const [dedName, setDedName] = useState("");
  const [dedType, setDedType] = useState("PF (Provident Fund)");
  const [dedPct, setDedPct] = useState("12");
  return {
    bonusEmp, setBonusEmp, bonusType, setBonusType, bonusAmount, setBonusAmount,
    dedName, setDedName, dedType, setDedType, dedPct, setDedPct,
  };
}
