export interface ModalContext {
  isRunModalOpen: boolean;
  setIsRunModalOpen: (val: boolean) => void;
  isStructModalOpen: boolean;
  setIsStructModalOpen: (val: boolean) => void;
  isReimbModalOpen: boolean;
  setIsReimbModalOpen: (val: boolean) => void;
  isBonusModalOpen: boolean;
  setIsBonusModalOpen: (val: boolean) => void;
  isDedModalOpen: boolean;
  setIsDedModalOpen: (val: boolean) => void;
  isAdvModalOpen: boolean;
  setIsAdvModalOpen: (val: boolean) => void;
  isTaxModalOpen: boolean;
  setIsTaxModalOpen: (val: boolean) => void;
}
