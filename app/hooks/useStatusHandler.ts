import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ResponseError } from "@/app/types/apiTypes";
import useAlert from "@/app/recoil/hooks/useAlert";
import useLoading from "@/app/recoil/hooks/useLoading";

export const useStatusHandler = (
  isLoading: boolean,
  error: unknown,
  t_ns: string
) => {
  const { t } = useTranslation(t_ns);
  const openAlert = useAlert();
  const { setLoadingState, clearLoadingState } = useLoading();

  useEffect(() => {
    if (isLoading) {
      setLoadingState();
    } else {
      clearLoadingState();
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      let msg = (error as ResponseError).message;
      if ((error as ResponseError).response) {
        msg = (error as ResponseError).response?.data?.message || msg;
      }
      openAlert(t(msg), "error");
    }
  }, [error]);
};
