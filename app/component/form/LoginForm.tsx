"use client";

import React, { useState } from "react";

import { LoginFormData, APIResponse } from "@/app/types/apiTypes";
import { useMutation } from "@tanstack/react-query";
import { loginSubmit } from "@/app/api/auth/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function LoginForm({
  action,
  children,
}: {
  action?: any;
  children: React.ReactNode;
}) {
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

  const useLogin = () => {
    const router = useRouter();
    return useMutation<APIResponse, Error, LoginFormData>({
      mutationFn: loginSubmit,
      onSuccess: (data: any) => {
        const accessToken = data.data.accessToken;
        const refreshToken = data.data.refreshToken;
        const decodedAccess = jwtDecode(accessToken);
        const decodedRefresh = jwtDecode(accessToken);
        let expirationDate = new Date();
        let refreshExpirationDate = new Date();
        if (decodedAccess.exp && decodedRefresh.exp) {
          expirationDate = new Date(decodedAccess.exp * 1000);
          refreshExpirationDate = new Date(decodedRefresh.exp * 1000);
          console.log("토큰 만료 시간:", expirationDate);
        } else {
          console.error("토큰에 만료 시간(exp)이 포함되지 않았습니다.");
          alert("로그인 실패하였습니다.");
          return;
        }

        // JWT를 쿠키에 저장
        Cookies.set("accessToken", accessToken, {
          httpOnly: false, // 클라이언트에서 접근 가능 (httpOnly는 서버에서만 설정 가능)
          secure: true, // HTTPS 환경에서만 전송
          sameSite: "Strict", // CSRF 방어
          expires: expirationDate, // 유효시간
        });
        Cookies.set("refreshToken", refreshToken, {
          httpOnly: false, // 클라이언트에서 접근 가능 (httpOnly는 서버에서만 설정 가능)
          secure: true, // HTTPS 환경에서만 전송
          sameSite: "Strict", // CSRF 방어
          expires: refreshExpirationDate, // 유효 시간
        });

        // 로그인 성공 후 리다이렉트 (예: 대시보드 페이지로 이동)
        const userId = "user01";
        router.push(urlConstants.pages.USERDASHBOARD(userId)); // 로그인 후 대시보드 페이지로 이동
      },
      onError: (error: Error) => {
        // 로그인 실패 시 처리할 로직
        alert("로그인 실패하였습니다.");
        console.error("Login failed:", error.message);
      },
    });
  };

  const { data, error, isError, isIdle, isPending, mutate } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData); // useLogin 훅을 통해 로그인 요청
  };

  return (
    <form
      action={action}
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
    >
      <div>
        <label
          htmlFor="userId"
          className="block text-xs text-gray-600 uppercase"
        >
          userId
        </label>
        <input
          id="userId"
          name="userId"
          type="text"
          placeholder="userId"
          autoComplete="userId"
          onChange={handleChange}
          value={formData.userId}
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
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
          onChange={handleChange}
          value={formData.password}
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      {children}
    </form>
  );
}
