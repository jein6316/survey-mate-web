'use client';
import Link from 'next/link';
import { LoginForm } from '@/app/component/form/LoginForm';
import { SubmitButton } from '@/app/component/button/Submit-button';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function App() {
  
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">SURVEY MATE</h3>
          <p className="text-sm text-gray-500">
            Create an account with your email and password
          </p>
        </div>
        <LoginForm>
          <SubmitButton>로그인</SubmitButton>
          <p className="text-center text-sm text-gray-600">
            {'Already have an account? '}
            <Link href={urlConstants.pages.REGISTER} className="font-semibold text-gray-800">
              회원가입
            </Link>
            {' instead.'}
          </p>
        </LoginForm>
      </div>
    </div>
    </QueryClientProvider>
  );
}
