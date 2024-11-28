'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { urlConstants } from '@/app/utils/urlConstants';
import { registerSubmit } from 'app/api/auth/auth';  
import { checkDuplicateIdAPI } from 'app/api/auth/auth';  
import { RegisterFormData } from '@/app/types/apiTypes';
import { getCurrentDate } from '@/app/utils/formatter';
export function RegisterForm({
  action,
  children,
}: {
  action?: any;
  children: React.ReactNode;
}) {

  const [formData, setFormData] = useState<RegisterFormData>({
    userId: '',
    password: '',
    passwordCheck:'',
    userName: '',
    profileImage : null,
    joinDate: getCurrentDate(), //오늘날짜
    memStatus: '1',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [idChecked, setIdChecked] = useState(false);//아이디 중복체크
  const [passwordChecked, setPasswordChecked] = useState(false);//비밀번호 체크
  const [errorId, setErrorId] = useState<string | null>(null);//아이디 에러
  const [errorPassword, setErrorPassword] = useState<string | null>(null); // 비밀번호 에러
  const [errorPasswordCheck, setErrorPasswordCheck] = useState<string | null>(
    null
  ); // 비밀번호 확인 에러
  const [errorRegister, setErrorRegister] = useState<string | null>(null);//회원가입 에러
  const router = useRouter(); // useRouter 훅 사용


  // 폼 입력 값 변경 처리
  const handleChange = (e : any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  // 파일 변경 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prevData) => ({
      ...prevData,
      profileImage: file,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // 비밀번호와 비밀번호 확인 검증
    validatePassword();
    validatePasswordCheck();

    setIsLoading(true);
    setErrorRegister(''); // 에러 초기화
    const result = await registerSubmit({ e, formData});
    setIsLoading(false);
    
    if (result.success) {
      router.push(urlConstants.pages.LOGIN);
    } else {
      if (result.error.response) {
        // 서버에서 반환한 에러 응답
        setErrorRegister(result.error?.message || '로그인 실패');
      } else {
        // 네트워크 오류나 기타 에러
        setErrorRegister('회원가입 요청 실패');
      }
    }
  };

  // 회원가입 상태가 변경된 후에 alert 실행
  useEffect(() => {
    if (errorRegister) {
      alert(errorRegister);
    }
  }, [errorRegister]); // errorRegister 상태가 변경될 때마다 실행
  //아이디 중복체크
  const checkDuplicateId = async (e: any) => {
    setErrorId(''); // 에러 초기화

    // 아이디 입력값 확인
    if (formData.userId === '') {
      setErrorId('아이디를 입력하세요.');
        return;
    }
    if (!/^[a-zA-Z0-9]{6,12}$/.test(formData.userId)) {
      setErrorId('아이디는 6~12자의 영문자 또는 숫자만 사용 가능합니다.');
        return;
    }

    // 서버와 통신하여 중복 확인
    const result = await checkDuplicateIdAPI(formData.userId);

    if (result.success) {
      setErrorId(''); // 에러 초기화
        alert('사용 가능한 아이디입니다.');
    } else {
      setErrorId(result.error?.message || '중복 체크 중 문제가 발생했습니다.');
    }
  };
  // 비밀번호 검증
  const validatePassword = () => {
    const { password } = formData;
    if (password.length < 8) {
      setErrorPassword("비밀번호는 최소 8자 이상이어야 합니다.");
    } else {
      setErrorPassword(null);
    }
  };
   // 비밀번호 확인 검증
  const validatePasswordCheck = () => {
    const { password, passwordCheck } = formData;
    if (passwordCheck !== password) {
      setErrorPasswordCheck("비밀번호가 일치하지 않습니다.");
    } else {
      setErrorPasswordCheck(null);
    }
  };


  return (
    <form
      action={action}
      autoComplete="off"
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
          onChange={handleChange}
          value={formData.userId}
          autoComplete="off"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <button type="button"  onClick ={checkDuplicateId}>아이디 체크 버튼</button>
      {errorId && <p className="mt-1 text-sm text-red-600">{errorId}</p>} {/* 아이디 에러 */}
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
          autoComplete="new-password"
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="passwordCheck"
          className="block text-xs text-gray-600 uppercase"
        >
          Password Check 
        </label>
        <input
          id="passwordCheck"
          name="passwordCheck"
          type="password"
          onChange={handleChange}
          value={formData.passwordCheck}
          required
          autoComplete="off"
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
        {errorPasswordCheck && (
          <p className="mt-1 text-sm text-red-600">{errorPasswordCheck}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="userName"
          className="block text-xs text-gray-600 uppercase"
        >
          userName
        </label>
        <input
          id="userName"
          name="userName"
          type="text"
          placeholder="userName"
          onChange={handleChange}
          value={formData.userName}
          autoComplete="off"
          required
          className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="profileImage"
          className="block text-xs text-gray-600 uppercase"
        >
          Profile Image
        </label>
        <input
          id="profileImage"
          name="profileImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1 block w-full text-gray-600"
        />
      </div>
      {children}
    </form>
  );
}
