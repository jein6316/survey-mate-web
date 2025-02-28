"use client";

import { useSetRecoilState } from "recoil";
import { loadingAtom, LoadingState } from "../atoms/loadingAtom";

const useLoading = () => {
  const setLoading = useSetRecoilState<LoadingState>(loadingAtom);

  const setLoadingState = (text: string = "Loading...") => {
    setLoading({
      isLoading: true,
      loadingText: text,
    });
  };

  const clearLoadingState = () => {
    setLoading({
      isLoading: false,
      loadingText: "",
    });
  };

  return {
    setLoadingState,
    clearLoadingState,
  };
};

export default useLoading;
