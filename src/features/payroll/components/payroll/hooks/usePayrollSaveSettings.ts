import { useUpdatePayrollSettingsMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollSaveSettings(props: any) {
  const [updatePayrollSettings] = useUpdatePayrollSettingsMutation();
  const handleSaveSettings = async (partialSettings: any) => {
    try {
      await updatePayrollSettings({ ...props.backendSettings, ...partialSettings }).unwrap();
      toast.success("Payroll policy settings saved and synchronized.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update payroll settings.");
    }
  };
  return { handleSaveSettings };
}
