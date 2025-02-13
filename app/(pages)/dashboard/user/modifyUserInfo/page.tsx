"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { modifyMemberAPI } from "@/app/api/auth/member";
import { modifyMemberPayload } from "@/app/types/apiTypes";
import { useMutation } from "@tanstack/react-query";
import { LoginFormData, APIResponse } from "@/app/types/apiTypes";
import { WithdrawalButton } from "@/app/component/button/WithdrawalButton";
import useAlert from "@/app/recoil/hooks/useAlert";

export default function ModifyUser({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [profileImageUuid, setProfileImageUuid] = useState<File | null>(null);
  const openAlert = useAlert();

  const {
    mutate: mutateModifyMember,
    isPending,
    isError,
    error,
  } = useMutation<APIResponse, Error, modifyMemberPayload>({
    mutationFn: modifyMemberAPI,
    onSuccess: (data) => {
      openAlert("회원정보가 성공적으로 수정되었습니다.", "info");
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
      window.isNullOrEmpty(userName) &&
      window.isInvalidFileType(profileImageUuid)
    ) {
      debugger;
      alert("수정할 사항을 입력하세요");
    }
    mutateModifyMember({
      userName: userName || undefined,
      profileImageUuid: profileImageUuid || null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 shadow-md rounded-md max-w-lg w-full">
        <h1 className="text-lg font-bold text-gray-700 mb-4">회원정보 수정</h1>
        <p className="text-sm text-gray-600 mb-4">
          수정할 User ID: <span className="font-bold">{params.id}</span>
        </p>

        <div className="mb-4">
          <label
            htmlFor="userName"
            className="block text-xs text-gray-600 uppercase mb-1"
          >
            회원 이름
          </label>
          <input
            id="userName"
            type="text"
            placeholder="회원 이름"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="profileImage"
            className="block text-xs text-gray-600 uppercase mb-1"
          >
            프로필 이미지
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          저장
        </button>
        <WithdrawalButton></WithdrawalButton>
      </div>
    </div>
  );
}
