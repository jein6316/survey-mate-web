"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  registerSubmit,
  checkUserEmailAPI,
  checkDuplicateIdAPI,
} from "app/api/auth/auth";
import {AlertModalProps, RegisterFormData} from "@/app/types/apiTypes";
import { getCurrentDate } from "@/app/utils/formatter";
import { LoginFormData, APIResponse } from "@/app/types/apiTypes";
import AlertModal from "@/app/component/common/modal/AlertModal";
import {data} from "autoprefixer";

export function RegisterForm({
  action,
  children,
}: {
  action?: any;
  children: React.ReactNode;
}) {
  //회원가입 데이터
  const [formData, setFormData] = useState<RegisterFormData>({
    userId: "",
    userEmail: "",
    password: "",
    passwordCheck: "",
    userName: "",
    profileImage: null,
    joinDate: getCurrentDate(), //오늘날짜
  });

  //변수선언
  const [verCode, setVerCode] = useState(""); //사용자가 입력가 이메일 인증코드
  const [resVerCode, setResVerCode] = useState(""); //받아온 인증코드
  const [isCheckedVerCode, setIsCheckedVerCode] = useState(false);

  const [idChecked, setIdChecked] = useState(false); //아이디 중복체크
  const [passwordChecked, setPasswordChecked] = useState(false); //비밀번호 체크
  const [errorId, setErrorId] = useState<string | null>(null); //아이디 에러
  const [errorPassword, setErrorPassword] = useState<string | null>(null); // 비밀번호 에러
  const [errorPasswordCheck, setErrorPasswordCheck] = useState<string | null>(
    null
  ); // 비밀번호 확인 에러
  const [errorRegister, setErrorRegister] = useState<string | null>(null); //회원가입 에러
  const router = useRouter(); // useRouter 훅 사용



  const [modalState, setModalState] = useState<AlertModalProps>({
    isOpen: false,
    title: "",
    message: "",
    onClose: ()=>{},
    type: data as "error" | "warning" | "info"
  });

  function openModal(title: string, message: string, type: "error" | "warning" | "info"): void {
    setModalState({
      isOpen: true,
      title,
      message,
      onClose: closeModal,
      type,
    });
  }

  function closeModal(){
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }



  // 폼 입력 값 변경 처리
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
  //이메일 인증 코드 값 변경 처리
  const handleChangeVerCode = (e: any) => {
    const { name, value } = e.target;
    setVerCode(value);
  };

  /*
   *아이디 중복 체크
   *
   */

  const {
    mutate: mutateCheckDupId,
    isPending,
    isError,
    error,
  } = useMutation<APIResponse, Error, string>({
    mutationFn: checkDuplicateIdAPI, // mutationFn 속성에 checkDuplicateId 함수를 할당
    onSuccess: (data: APIResponse) => {
        data.result ? openModal("아이디 사용 가능", data.message? data.message : "사용 가능한 아이디 입니다.", "info")
            : openModal("아이디 사용 불가", data.message? data.message : "이미 사용중인 아이디가 있습니다.", "warning")
    },
    onError: (error: Error) => {
      console.error("아이디 중복 체크 실패:", error.message);
      let message = error.response?.data?.message;
      if(!message){
        message = error.message;
      }
      openModal("아이디 중복 체크 실패", message, "error");
    },
  });

  const handleDuplicateId = async (e: any) => {
    setErrorId(""); // 에러 초기화

    // 아이디 입력값 확인
    if (formData.userId === "") {
      setErrorId("아이디를 입력하세요.");
      return;
    }
    if (!/^[a-zA-Z0-9]{6,12}$/.test(formData.userId)) {
      setErrorId("아이디는 6~12자의 영문자 또는 숫자만 사용 가능합니다.");
      return;
    }

    // 서버와 통신하여 중복 확인
    mutateCheckDupId(formData.userId);
  };

  // 회원가입 상태가 변경된 후에 alert 실행
  useEffect(() => {
    if (errorRegister) {
      alert(errorRegister);
    }
  }, [errorRegister]); // errorRegister 상태가 변경될 때마다 실행

  // 회원가입 폼 입력값 체크
  const validateForm = () => {
    if (formData.password.length < 8) {
      setErrorPassword("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    } else {
      setErrorPassword(null);
    }

    if (formData.passwordCheck !== formData.password) {
      setErrorPasswordCheck("비밀번호가 일치하지 않습니다.");
    } else {
      setErrorPasswordCheck(null);
    }
  };
  /*
   *이메일 검증
   *
   */
  const { mutate: mutateCheckEmail } = useMutation<APIResponse, Error, string>({
    mutationFn: checkUserEmailAPI, // mutationFn 속성에 checkDuplicateId 함수를 할당
    onSuccess: (data: APIResponse) => {
      openModal("이메일 인증", "이메일로 인증번호가 전송되었습니다.", "info");
      setResVerCode(data.data);
    },
    onError: (error: Error) => {
      openModal("이메일 인증 실패", "이메일 인증 실패하였습니다.", "error");
      setResVerCode("");
    },
  });
  const handleCheckEmail = async () => {
    mutateCheckEmail(formData.userEmail);
  };
  // 이메일 인증번호 체크
  const checkVerCode = async () => {
    if (verCode == null || verCode == "") {
      openModal("이메일 인증", "인증번호를 입력해 주세요.", "error");
      setIsCheckedVerCode(false);
    }
    else if (verCode != resVerCode) {
      openModal("이메일 인증 실패", "인증번호가 일치하지 않습니다.", "error");
      setIsCheckedVerCode(false);
    } else {
      openModal("이메일 인증 성공", "인증번호가 일치합니다.", "info");
      setIsCheckedVerCode(true);
    }
  };

  /*
   *회원가입 처리
   *
   */
  const {
    data: registerData,
    error: registerError,
    isError: isRegisterError,
    isIdle: isRegisterIdle,
    isPending: isRegisterPending,
    mutate: mutateRegister,
  } = useMutation<APIResponse, Error, RegisterFormData>({
    mutationFn: registerSubmit, // mutationFn 속성에 checkDuplicateId 함수를 할당
    onSuccess: (data: any) => {
      openModal("회원가입 성공!", "회원가입 되었습니다.", "info");
      console.log("회원가입 성공 데이터:", data);
    },
    onError: (error: Error) => {
      openModal("회원가입 실패!", "회원가입에 실패했습니다.", "error");
      console.error("Login failed:", error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //이메일인증 확인
    if (!isCheckedVerCode) {
      openModal("이메일 인증", "이메일 인증 확인이 되지 않았습니다.", "error");
      return;
    }

    // 데이터 유효성 체크
    validateForm();
    setErrorRegister(""); // 에러 초기화
    mutateRegister(formData); // 회원가입 요청 실행
  };
  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="flex flex-col space-y-6 bg-white shadow-lg rounded-lg p-8 max-w-lg mx-auto"
    >

      <AlertModal
          isOpen={modalState.isOpen}
          title={modalState.title}
          message={modalState.message}
          onClose={modalState.onClose}
          type={modalState.type}
      />

      <h2 className="text-2xl font-bold text-gray-800 text-center">회원가입</h2>

      {/* User ID */}
      <div>
        <label
          htmlFor="userId"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          User ID
        </label>
        <div className="flex items-center space-x-2">
          <input
            id="userId"
            name="userId"
            type="text"
            placeholder="Enter your ID"
            onChange={handleChange}
            value={formData.userId}
            required
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
          />
          <button
            type="button"
            onClick={handleDuplicateId}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
          >
            체크
          </button>
        </div>
        {errorId && <p className="mt-2 text-sm text-red-500">{errorId}</p>}
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="userEmail"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          이메일
        </label>
        <div className="flex items-center space-x-2">
          <input
            id="userEmail"
            name="userEmail"
            type="email"
            placeholder="Enter your email"
            onChange={handleChange}
            value={formData.userEmail}
            required
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
          />
          <button
            type="button"
            onClick={handleCheckEmail}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
          >
            체크
          </button>
        </div>
      </div>

      {/* Verification Code */}
      <div>
        <label
          htmlFor="verCode"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          이메일 인증 확인
        </label>
        <div className="flex items-center space-x-2">
          <input
            id="verCode"
            name="verCode"
            type="text"
            placeholder="Enter verification code"
            onChange={handleChangeVerCode}
            value={verCode}
            required
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
          />
          <button
            type="button"
            onClick={checkVerCode}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 focus:ring focus:ring-green-300"
          >
            인증
          </button>
        </div>
      </div>

      {/* Password */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          onChange={handleChange}
          value={formData.password}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
        />
      </div>

      {/* Password Check */}
      <div>
        <label
          htmlFor="passwordCheck"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          비밀번호 확인
        </label>
        <input
          id="passwordCheck"
          name="passwordCheck"
          type="password"
          placeholder="Confirm your password"
          onChange={handleChange}
          value={formData.passwordCheck}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
        />
        {errorPasswordCheck && (
          <p className="mt-2 text-sm text-red-500">{errorPasswordCheck}</p>
        )}
      </div>

      {/* User Name */}
      <div>
        <label
          htmlFor="userName"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          User Name
        </label>
        <input
          id="userName"
          name="userName"
          type="text"
          placeholder="Enter your name"
          onChange={handleChange}
          value={formData.userName}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 sm:text-sm"
        />
      </div>

      {/* Profile Image */}
      <div>
        <label
          htmlFor="profileImage"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          프로필 이미지
        </label>
        <input
          id="profileImage"
          name="profileImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:bg-gray-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {/* Children */}
      {children}
    </form>
  );
}
