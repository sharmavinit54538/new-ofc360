import { useCreateRegularizationAction } from "./regularization/useCreateRegularizationAction";
import type { RegularizationRequest } from "../../types/attendance.types";

export function useRegularizationActions(p: {
  user?: { id?: string; name?: string } | null;
  regModal: { regDate: string; regType: RegularizationRequest["missedPunchType"]; regTime: string; regReason: string; setRegReason: (v: string) => void; setIsRegModalOpen: (v: boolean) => void };
  addRegularization: (reg: RegularizationRequest) => void;
  updateRegularizationStatus: (id: string, status: string, approverName?: string, reviewComment?: string) => void;
}) {
  const handleCreateRegularization = useCreateRegularizationAction(p);
  return { handleCreateRegularization, updateRegularizationStatus: p.updateRegularizationStatus };
}
