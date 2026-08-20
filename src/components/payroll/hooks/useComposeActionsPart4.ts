import { usePayrollGenerateBankAdvice, usePayrollDownloadBankAdvice, usePayrollGenerateCompliance, usePayrollExportLedger, usePayrollSaveSettings, usePayrollCopilotChatAction } from "./index";

export function useComposeActionsPart4(state: any) {
  const genBank = usePayrollGenerateBankAdvice();
  const downBank = usePayrollDownloadBankAdvice();
  const genComp = usePayrollGenerateCompliance();
  const expLedger = usePayrollExportLedger();
  const saveSet = usePayrollSaveSettings(state);
  const sendCop = usePayrollCopilotChatAction(state);
  return { ...genBank, ...downBank, ...genComp, ...expLedger, ...saveSet, ...sendCop };
}
