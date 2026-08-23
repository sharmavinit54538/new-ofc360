import { useCreateTaxMutation } from "@/features/payroll";
import { toast } from "sonner";

export function usePayrollTaxDeclaration(props: any) {
  const [createTax, { isLoading: isCreatingTax }] = useCreateTaxMutation();
  const handleCreateTaxDeclaration = async () => {
    try {
      await createTax({
        name: `TDS Declaration - ${props.user?.name || "Employee"}`, tax_code: props.taxRegime,
        rate: parseFloat(props.tax80C) || 150000, is_percentage: false, is_active: true,
      }).unwrap();
      toast.success("IT TDS Tax declaration saved to backend!");
      props.setIsTaxModalOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save tax declaration.");
    }
  };
  return { handleCreateTaxDeclaration, isCreatingTax };
}
