"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { APIResponse } from "@/app/types/apiTypes";
import { findIdByEmailAPI } from "@/app/api/auth/auth";

export default function FindIdByEmail() {
  const [email, setEmail] = useState(""); // 이메일 입력 상태

  // API 호출 로직 (React Query의 useMutation 사용)
  const { data, error, isError, isPending, mutate } = useMutation<
    APIResponse,
    Error,
    string
  >({
    mutationFn: findIdByEmailAPI,
    onSuccess: (data: any) => {
      alert(`아이디 찾기 성공! 찾은 아이디: ${data?.data}`);
    },
    onError: (error: Error) => {
      alert("아이디 찾기 실패! 이메일을 다시 확인하세요.");
    },
  });

  const handleClick = () => {
    if (!email) {
      alert("이메일을 입력해주세요!");
      return;
    }
    mutate(email); // 입력된 이메일로 API 호출
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm space-y-6 rounded-lg bg-white p-6 shadow-md">
        <h1 className="text-center text-xl font-bold text-gray-900">
          아이디 찾기
        </h1>
        <p className="text-center text-sm text-gray-600">
          이메일을 입력하여 아이디를 찾으세요.
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일을 입력하세요"
          className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={handleClick}
          disabled={isPending}
          className="flex h-10 w-full items-center justify-center rounded-md bg-blue-500 text-sm font-semibold text-white transition-all hover:bg-blue-600 focus:outline-none"
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
            "아이디 찾기"
          )}
        </button>
        {isError && (
          <p className="text-center text-sm text-red-500">
            아이디 찾기 실패! 이메일을 다시 확인하세요.
          </p>
        )}
      </div>
    </div>
  );
}
