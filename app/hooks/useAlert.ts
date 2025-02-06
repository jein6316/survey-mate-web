import { useSetRecoilState } from "recoil";
import { alertModalState } from "@/app/recoil/atoms/alertModalAtom";

const useAlert = () => {
  const setModalState = useSetRecoilState(alertModalState);

  const openAlert = (
    arg1: string | null,
    arg2?: string | "error" | "info" | "warning",
    arg3?: "error" | "info" | "warning",
    onClose?: () => void
  ): void => {
    if (arg2 === undefined) {
      // 메시지만 받은 경우
      setModalState({
        isOpen: true,
        title: null,
        message: arg1 as string,
        type: "info", // 기본 타입
        onClose: undefined,
      });
    } else if (typeof arg2 === "string" && arg3 === undefined) {
      // 메시지와 타입을 받은 경우
      setModalState({
        isOpen: true,
        title: null,
        message: arg1 as string,
        type: arg2 as "error" | "info" | "warning",
        onClose: undefined,
      });
    } else if (
      typeof arg2 === "string" &&
      typeof arg3 === "string" &&
      onClose === undefined
    ) {
      // 풀 타입 (title, message, type) 모두 받은 경우
      setModalState({
        isOpen: true,
        title: arg1,
        message: arg2 as string,
        type: arg3 as "error" | "info" | "warning",
        onClose: undefined,
      });
    } else {
      // 메시지와 콜백 함수를 받은 경우
      setModalState({
        isOpen: true,
        title: arg1 as string,
        message: arg2 as string,
        type: "info", // 기본 타입
        onClose,
      });
    }
  };

  return openAlert;
};

export default useAlert;
