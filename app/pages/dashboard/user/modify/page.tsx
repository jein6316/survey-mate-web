"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { modifyMemberAPI } from "@/app/api/auth/member";
import { modifyMemberPayload } from "@/app/types/apiTypes";
import { useMutation } from "@tanstack/react-query";
import { LoginFormData, APIResponse } from "@/app/types/apiTypes";
import api from "@/app/api/auth/api";

export default function ModifyUser({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [profileImageUuid, setProfileImageUuid] = useState<File | null>(null);

  const {
    mutate: mutateModifyMember,
    isPending,
    isError,
    error,
  } = useMutation<APIResponse, Error, modifyMemberPayload>({
    mutationFn: modifyMemberAPI,
    onSuccess: (data) => {
      debugger;
      alert("회원정보가 성공적으로 수정되었습니다.");
    },
    onError: (error) => {
      console.error("회원정보 수정 실패:", error);
      alert(error.message || "회원정보 수정 중 문제가 발생했습니다.");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageUuid(e.target.files[0]);
    }
  };
  const handleSubmit = () => {
    if (
      window.isNullOrEmpty(userName) ||
      window.isInvalidFileType(profileImageUuid)
    ) {
      alert("수정할 사항을 입력하세요");
    }
    mutateModifyMember({
      userName: userName || undefined,
      profileImageUuid: profileImageUuid || null,
    });
  };

  return (
    <div>
      <h1>회원정보 수정</h1>
      <p>수정할 User ID: {params.id}</p>
      <input
        type="text"
        placeholder="회원 이름"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleSubmit}>저장</button>
    </div>
  );
}
