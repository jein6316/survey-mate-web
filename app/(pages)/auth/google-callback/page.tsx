"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useMutationLogin from "@/app/hooks/useMutationLogin"; // 커스텀 훅 가져오기
import { loginGoogleAPI } from "@/app/api/auth/auth";
import { APIResponse } from "@/app/types/apiTypes";

export default function GoogleCallback() {
  const router = useRouter();
  const isCalled = useRef(false); // Ref로 호출 여부 관리

  // useMutationHandler 사용
  const { mutate } = useMutationLogin<APIResponse, string>(loginGoogleAPI, {});

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const hash = window.location.hash;
      const token = new URLSearchParams(hash.substring(1)).get("access_token");
      if (token !== null) {
        mutate(token); // 토큰 전달하여 로그인 API 호출
      } else {
        alert("로그인 실패");
      }
    };

    if (!isCalled.current) {
      handleGoogleCallback();
      isCalled.current = true; // 호출 여부 업데이트
    }
  }, [mutate]);

  return <div>Processing Google Login...</div>;
}
