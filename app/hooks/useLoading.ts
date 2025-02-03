import { useSetRecoilState } from "recoil";
import { loadingState, LoadingState } from "../recoil/atoms/loadingAtom";

const useLoading = () => {
  const setLoading = useSetRecoilState<LoadingState>(loadingState);

  const setLoadingState = (text: string) => {
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
