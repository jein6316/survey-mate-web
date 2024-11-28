'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { loginSubmit } from 'app/api/auth/auth';
import { urlConstants } from '@/app/utils/urlConstants';
import { LoginFormData } from '@/app/types/apiTypes';


export function LoginForm({
  action,
  children,
}: {
  action?: any;
  children: React.ReactNode;
}) {

  const [formData, setFormData] = useState<LoginFormData>({
    userId: '',
    password: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // useRouter 훅 사용


  // 폼 입력 값 변경 처리
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    setError(''); // 에러 초기화
    const result = await loginSubmit({ e, formData });
    setIsLoading(false);

    if (result.success) {
      router.push(urlConstants.pages.LOGIN);
    } else {
      if (result.error.response) {
        // 서버에서 반환한 에러 응답
        setError(result.error.response.error || '로그인 실패');
      } else {
        // 네트워크 오류나 기타 에러
        setError('로그인 요청 실패');
      }
      //TODO 팝업
    }

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
