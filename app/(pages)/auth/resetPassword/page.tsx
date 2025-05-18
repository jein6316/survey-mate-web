"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { APIResponse } from "@/app/types/apiTypes";
import { checkUserEmailAPI, restPasswordAPI } from "@/app/web-api/auth/auth";

export default function ResetPassword() {
  const [email, setEmail] = useState(""); // 이메일 입력 상태
  const [verCode, setVerCode] = useState(""); //사용자가 입력가 이메일 인증코드
  const [resVerCode, setResVerCode] = useState(""); //받아온 인증코드
  const [isCheckedVerCode, setIsCheckedVerCode] = useState(false);
  // API 호출 로직 (React Query의 useMutation 사용)
  const { data, error, isError, isPending, mutate } = useMutation<
    APIResponse,
    Error,
    string
  >({
    mutationFn: restPasswordAPI,
    onSuccess: (data: any) => {
      alert(`아이디 찾기 성공! 찾은 아이디: ${data?.data}`);
    },
    onError: (error: Error) => {
      alert("아이디 찾기 실패! 이메일을 다시 확인하세요.");
    },
  });

  const handleClick = () => {
    if (!email) {
      alert("이메일을 입력해주세요!");
      return;
    }
    mutate(email); // 입력된 이메일로 API 호출
  };
  /*
   *이메일 검증
   *
   */
  const { mutate: mutateCheckEmail } = useMutation<APIResponse, Error, string>({
    mutationFn: checkUserEmailAPI, // mutationFn 속성에 checkDuplicateId 함수를 할당
    onSuccess: (data: APIResponse) => {
      alert("이메일로 인증번호가 전송되었습니다.");
      setResVerCode(data.data);
    },
    onError: (error: Error) => {
      alert("이메일 인증 실패하였습니다.");
      setResVerCode("");
    },
  });
  const handleCheckEmail = async () => {
    mutateCheckEmail(email);
  };
  // 이메일 인증번호 체크
  const checkVerCode = async () => {
    if (verCode == null || verCode == "") {
      alert("인증번호");
      setIsCheckedVerCode(false);
    }
    if (verCode != resVerCode) {
      alert("인증번호가 일치하지 않습니다.");
      setIsCheckedVerCode(false);
    } else {
      alert("인증번호가 일치합니다.");
      setIsCheckedVerCode(true);
    }
  };
  //이메일 인증 코드 값 변경 처리
  const handleChangeVerCode = (e: any) => {
    const { name, value } = e.target;
    setVerCode(value);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-bold text-gray-900">
          비밀번호 재설정
        </h1>
        <p className="text-center text-sm text-gray-600">
          이메일을 입력하여{" "}
          <span className="font-semibold">아이디를 찾으세요</span>.
        </p>

        {/* 이메일 입력 */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            이메일
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        {/* 이메일 체크 버튼 */}
        <button
          type="button"
          onClick={handleCheckEmail}
          className="w-full rounded-md bg-blue-500 py-2 text-sm font-medium text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          이메일 인증 번호 발송
        </button>

        {/* 인증 코드 입력 */}
        <div>
          <label
            htmlFor="verCode"
            className="block text-sm font-medium text-gray-700"
          >
            인증 코드
          </label>
          <input
            id="verCode"
            name="verCode"
            type="text"
            placeholder="인증 코드를 입력하세요"
            onChange={handleChangeVerCode}
            value={verCode}
            required
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        {/* 인증 코드 체크 버튼 */}
        <button
          type="button"
          onClick={checkVerCode}
          className="w-full rounded-md bg-green-500 py-2 text-sm font-medium text-white transition hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          인증 코드 확인
        </button>

        {/* 아이디 찾기 버튼 */}
        <button
          onClick={handleClick}
          disabled={isPending}
          className={`w-full flex items-center justify-center rounded-md bg-blue-500 py-2 text-sm font-medium text-white transition ${
            isPending ? "cursor-not-allowed bg-blue-400" : "hover:bg-blue-600"
          }`}
        >
          {isPending ? (
            <>
              처리 중...
              <svg
                className="animate-spin ml-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            </>
          ) : (
            "아이디 찾기"
          )}
        </button>

        {/* 에러 메시지 */}
        {isError && (
          <p className="text-center text-sm text-red-500 mt-4">
            아이디 찾기 실패! 이메일을 다시 확인하세요.
          </p>
        )}
      </div>
    </div>
  );
}
