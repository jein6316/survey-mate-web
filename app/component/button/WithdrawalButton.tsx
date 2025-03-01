"use client";

import { useState } from "react";

export function WithdrawalButton() {
  const [isPending, setIsPending] = useState(false);

  const handleWithdrawal = async () => {
    setIsPending(true);

    try {
      if (typeof window !== "undefined") {
        window.location.href = "/api/logout"; // 🚀 서버에서 로그아웃 처리
      }
    } catch (error) {
      console.error("회원 탈퇴 처리 중 오류 발생:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleWithdrawal}
      disabled={isPending}
      className="flex h-10 w-full items-center justify-center rounded-md border bg-red-500 text-white text-sm transition-all hover:bg-red-600 focus:outline-none disabled:bg-red-300"
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
        "회원 탈퇴"
      )}
    </button>
  );
}
