"use client";

import React, { useState } from "react";
import { LoginFormData, APIResponse } from "@/app/types/apiTypes";
import { loginSubmit } from "@/app/api/auth/auth";
import useMutationLogin from "@/app/hooks/useMutationLogin";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SubmitButton } from "@/app/component/button/SubmitButton";
import { useTranslation } from "react-i18next";

export function LoginForm({
  action,
  children,
}: {
  action?: any;
  children?: React.ReactNode;
}) {
  const router = useRouter(); // useRouter 훅 사용
  const { t } = useTranslation("auth");

  //로그인 폼데이터
  const [formData, setFormData] = useState<LoginFormData>({
    userId: "",
    password: "",
  });
  // 폼 입력 값 변경 처리
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const { mutate } = useMutationLogin<APIResponse, LoginFormData>(
    loginSubmit,
    {}
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData); // useLogin 훅을 통해 로그인 요청
  };
  // Google OAuth 로그인 처리
  const handleGoogleLogin = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=24831698320-vvlj7h93mdlen8ot8tbv6t5m931eh34e.apps.googleusercontent.com&redirect_uri=http://localhost:3000/auth/google-callback&response_type=token&scope=email profile`;
    window.location.href = googleAuthUrl; // Google 인증 페이지로 리디렉션
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-50 px-4">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-lg border border-gray-300 shadow-lg bg-white -mt-40">
        {/* 헤더 */}
        <header className="flex flex-col items-center justify-center space-y-2 border-b border-gray-200 px-6 py-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">SURVEY MATE</h1>
        </header>

        {/* 로그인 폼 */}
        <form
          action={action}
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 bg-gray-50 px-6 py-8 sm:px-16"
        >
          <div>
            <label
              htmlFor="userId"
              className="block text-xs text-gray-600 uppercase"
            >
              ID
            </label>
            <input
              id="userId"
              name="userId"
              type="text"
              placeholder="Enter your user ID"
              autoComplete="userId"
              onChange={handleChange}
              value={formData.userId}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-xs text-gray-600 uppercase"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              value={formData.password}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
          <SubmitButton>{t("LOGIN")}</SubmitButton>
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Login with Google
          </button>

          {/* 추가 옵션 */}
          <div className="flex flex-col items-center space-y-4 pt-4">
            <button
              onClick={() => router.push(urlConstants.pages.FINDIDBYEMAIL)}
              className="text-sm font-semibold text-blue-500 hover:text-blue-600 focus:outline-none focus:underline"
            >
              {t("FIND_ID")}
            </button>
            <button
              onClick={() => router.push(urlConstants.pages.RESETPASSWORD)}
              className="text-sm font-semibold text-blue-500 hover:text-blue-600 focus:outline-none focus:underline"
            >
              {t("RESET_PASSWORD")}
            </button>
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                href={urlConstants.pages.REGISTER}
                className="font-semibold text-blue-500 hover:text-blue-600 focus:outline-none focus:underline"
              >
                {t("SIGN_UP")}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
