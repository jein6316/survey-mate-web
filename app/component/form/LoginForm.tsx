"use client";

import React, { useState } from "react";
import { LoginFormData, APIResponse } from "@/app/types/apiTypes";
import { loginSubmit } from "@/app/api/auth/auth";
import useMutationLogin from "@/app/hooks/useMutationLogin";

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
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=24831698320-vvlj7h93mdlen8ot8tbv6t5m931eh34e.apps.googleusercontent.com&redirect_uri=http://localhost:3000/pages/auth/google-callback&response_type=token&scope=email profile`;
    window.location.href = googleAuthUrl; // Google 인증 페이지로 리디렉션
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
          비밀번호
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
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full bg-blue-500 text-white py-2 rounded-md"
      >
        Login with Google
      </button>
    </form>
  );
}
