import { atom } from "recoil";

export interface AlertModalState {
  isOpen: boolean;
  title: string | null;
  message: string;
  type: "error" | "info" | "warning";
  onClose?: () => void; // 콜백 함수 추가
}

export const alertModalAtom = atom<AlertModalState>({
  key: "alertModalState", // 고유 key (필수)
  default: {
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onClose: undefined, // 기본값 설정
  },
});
