export type ModalMode = "check-in" | "check-out";

export interface FaceAttendanceFilterProps {
  status: string;
  setStatus: (s: string) => void;
  page: number;
  setPage: (p: number | ((prev: number) => number)) => void;
}
