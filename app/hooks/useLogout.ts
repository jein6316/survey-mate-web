"use client";

import { useRouter } from "next/navigation";
import useLoading from "../recoil/hooks/useLoading";
import { useRecoilValue } from "recoil";
import useUser from "@/app/recoil/hooks/useUser";
import { userAtom } from "@/app/recoil/atoms/userAtom";
import { useCallback } from "react";
import Cookies from "js-cookie";

export const logout = () => {
  if (typeof window !== "undefined") {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    // Cookies.remove("social");
    // Cookies.remove("user_role");

    window.location.href = "/"; // 로그인 페이지 또는 메인 페이지로 이동
  }
};

const useLogout = () => {
  const { setUserFromToken } = useUser();
  const user = useRecoilValue(userAtom);
  const { setLoadingState, clearLoadingState } = useLoading();
  const router = useRouter();

  const removeCookies = () => {
    if (typeof window !== "undefined") {
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      // Cookies.remove("social");
      // Cookies.remove("user_role");
    }
  };

  const logout = useCallback(() => {
    setLoadingState("logout");

    const socialType = user?.social;
    removeCookies();
    setUserFromToken();
    try {
      if (socialType === "google") {
        // 구글 로그아웃 URL로 리다이렉트
        const googleLogoutUrl = "https://accounts.google.com/Logout";
        window.location.href = googleLogoutUrl;
        return; // 이후 코드 실행 방지
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    } finally {
      clearLoadingState();
    }
  }, [setLoadingState, clearLoadingState, user, setUserFromToken]);

  return logout;
};

export default useLogout;
