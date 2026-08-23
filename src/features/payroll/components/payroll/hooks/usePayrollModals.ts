import { useState } from "react";

export function usePayrollModals() {
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const [isStructModalOpen, setIsStructModalOpen] = useState(false);
  const [isReimbModalOpen, setIsReimbModalOpen] = useState(false);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [isDedModalOpen, setIsDedModalOpen] = useState(false);
  const [isAdvModalOpen, setIsAdvModalOpen] = useState(false);
  const [isTaxModalOpen, setIsTaxModalOpen] = useState(false);
  return {
    isRunModalOpen, setIsRunModalOpen, isStructModalOpen, setIsStructModalOpen,
    isReimbModalOpen, setIsReimbModalOpen, isBonusModalOpen, setIsBonusModalOpen,
    isDedModalOpen, setIsDedModalOpen, isAdvModalOpen, setIsAdvModalOpen, isTaxModalOpen, setIsTaxModalOpen,
  };
}
