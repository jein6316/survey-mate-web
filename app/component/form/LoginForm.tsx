'use client';

import React, { useState } from 'react';

import axios from 'axios';
import { useRouter } from 'next/navigation';
export function LoginForm({
  action,
  children,
}: {
  action?: any;
  children: React.ReactNode;
}) {

  const [formData, setFormData] = useState({
    userId: '',
    password: ''
  });

  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // useRouter 훅 사용
 

  // 폼 입력 값 변경 처리
  const handleChange = (e : any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // 폼 제출 시 새로 고침을 막음
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,  // 엔드포인트 URL
        formData,  // FormData 객체를 전송
        {
            headers: {
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LOGIN_TOKEN}`,  // Authorization 헤더에 Bearer 토큰 포함                
                'Content-Type': 'multipart/form-data',  // 요청 헤더에 Content-Type 설정
            }
        }
    );
      // 로그인 성공 처리
      const data = res.data;
      console.log('로그인 성공:', data);
      // 로그인 성공 후 추가 작업 (예: 토큰 저장, 페이지 이동 등)
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      router.push('/main');

    } catch (error:any) {
        if (error.response) {
            // 서버에서 반환한 에러 응답
            const errorData = error.response.data;
            setError(errorData.error || '로그인 실패');
        } else {
            // 네트워크 오류나 기타 에러
            setError('로그인 요청 실패');
        }
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
