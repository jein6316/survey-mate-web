"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export function LogoutButton() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsPending(true);

    try {
      // 쿠키에서 토큰 삭제
      Cookies.remove("accessToken"); // authToken은 삭제할 토큰의 쿠키 이름
      Cookies.remove("refreshToken");
      // 메인 페이지로 리다이렉트
      router.push("/");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      aria-disabled={isPending}
      className="flex h-10 w-full items-center justify-center rounded-md border bg-red-500 text-white text-sm transition-all hover:bg-red-600 focus:outline-none"
    >
      {isPending ? (
        <>
          처리 중...
          <svg
            className="animate-spin ml-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </>
      ) : (
        "로그아웃"
      )}
    </button>
  );
}
