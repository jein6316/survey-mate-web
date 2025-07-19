"use client";

import { useEffect, useRef } from "react";
import useMutationLogin from "@/app/hooks/useMutationLogin"; // 커스텀 훅 가져오기
import { loginGoogleAPI } from "@/app/web-api/auth/auth";
import { APIResponse } from "@/app/types/apiTypes";

export default function GoogleCallback() {
  const isCalled = useRef(false);

  const { mutate } = useMutationLogin<APIResponse, string>(loginGoogleAPI, {});

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const hash = window.location.hash;
      const token = new URLSearchParams(hash.substring(1)).get("access_token");
      if (token !== null) {
        mutate(token);
      } else {
        alert("로그인 실패");
      }
    };

    if (!isCalled.current) {
      handleGoogleCallback();
      isCalled.current = true;
    }
  }, [mutate]);

  return <div>Processing Google Login...</div>;
}
