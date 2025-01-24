import {useSetRecoilState} from "recoil";
import {alertModalState} from "@/app/recoil/atoms/alertModalAtom";

function useAlert() {
    const setModalState = useSetRecoilState(alertModalState);

    function openAlert(message: string): void; // 메시지만 받을 경우
    function openAlert(message: string, type: "error" | "info" | "warning"): void;
    function openAlert(title: string | null, message: string, type: "error" | "info" | "warning"): void; // 풀 타입


    function openAlert(
        arg1: string | null,
        arg2?: string | "error" | "info" | "warning",
        arg3?: "error" | "info" | "warning"
    ): void {
        if (arg2 === undefined) {
            // 메시지만 받은 경우
            setModalState({
                isOpen: true,
                title: null,
                message: arg1 as string,
                type: "info", // 기본 타입
            });
        } else if (typeof arg2 === "string" && arg3 === undefined) {
            // 메시지와 타입을 받은 경우
            setModalState({
                isOpen: true,
                title: null,
                message: arg1 as string,
                type: arg2 as "error" | "info" | "warning",
            });
        } else {
            // 풀 타입 (title, message, type) 모두 받은 경우
            setModalState({
                isOpen: true,
                title: arg1,
                message: arg2 as string,
                type: arg3 as "error" | "info" | "warning",
            });
        }
    }

    return openAlert;
}

export default useAlert;
