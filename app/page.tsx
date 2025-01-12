"use client";
import Link from "next/link";
import { LoginForm } from "@/app/component/form/LoginForm";
import { SubmitButton } from "@/app/component/button/Submit-button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter(); // useRouter 훅 사용

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen w-screen items-center justify-center bg-gray-50 px-4">
        <div className="z-10 w-full max-w-md overflow-hidden rounded-lg border border-gray-300 shadow-lg bg-white">
          {/* 헤더 */}
          <div className="flex flex-col items-center justify-center space-y-2 border-b border-gray-200 px-6 py-8 text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">
              SURVEY MATE
            </h1>
          </div>

          {/* 로그인 폼 */}
          <div className="px-6 py-6">
            <LoginForm>
              <SubmitButton>로그인</SubmitButton>
            </LoginForm>
          </div>

          {/* 링크와 추가 옵션 */}
          <div className="flex flex-col items-center space-y-4 px-6 pb-8">
            <button
              onClick={() => router.push(urlConstants.pages.FINDIDBYEMAIL)}
              className="text-sm font-semibold text-blue-500 hover:text-blue-600 focus:outline-none focus:underline"
            >
              아이디 찾기
            </button>
            <button
              onClick={() => router.push(urlConstants.pages.RESETPASSWORD)}
              className="text-sm font-semibold text-blue-500 hover:text-blue-600 focus:outline-none focus:underline"
            >
              비밀번호 재설정
            </button>
            <p className="text-sm text-gray-600">
              계정이 없으신가요?{" "}
              <Link
                href={urlConstants.pages.REGISTER}
                className="font-semibold text-blue-500 hover:text-blue-600 focus:outline-none focus:underline"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
