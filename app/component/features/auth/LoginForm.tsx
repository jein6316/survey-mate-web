"use client";

import React, { useState, useEffect } from "react";
import { LoginFormData, APIResponse } from "@/app/types/apiTypes";
import { loginSubmit } from "@/app/web-api/auth/auth";
import useMutationLogin from "@/app/hooks/useMutationLogin";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SubmitButton } from "@/app/component/button/SubmitButton";
import { useTranslation } from "react-i18next";
import { userAtom } from "@/app/recoil/atoms/userAtom";
import { useRecoilValue } from "recoil";

export function LoginForm({
  action,
  children,
}: {
  action?: any;
  children?: React.ReactNode;
}) {
  const router = useRouter(); // useRouter 훅 사용
  const { t } = useTranslation("auth");
  const user = useRecoilValue(userAtom);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "";

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

  const { mutate } = useMutationLogin<APIResponse, LoginFormData>(loginSubmit, {
    redirect: redirectParam,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  // Google OAuth 로그인 처리
  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_NEXTAUTH_URL;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}/auth/google-callback&response_type=token&scope=email profile`;
    window.location.href = googleAuthUrl;
  };
  useEffect(() => {
    if (user.isLoggedIn && !redirectParam) {
      router.push(urlConstants.pages.USERDASHBOARD);
    } else {
      setLoading(false);
    }
  }, [user.isLoggedIn, router]);

  if (loading) {
    return null;
  }

  return (
    <div className="flex min-h-[92vh] w-screen items-center justify-center bg-gray-50">
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
            className="flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition"
            onClick={handleGoogleLogin}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              className="w-5 h-5"
            />
            <span className="font-medium">{t("SIGNIN_WITH_GOOGLE")}</span>
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
