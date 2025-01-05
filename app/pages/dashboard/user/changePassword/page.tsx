"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { changePassword } from "@/app/api/auth/member";
import { useMutation } from "@tanstack/react-query";
import { APIResponse } from "@/app/types/apiTypes";

export default function ChangePassword({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate, isPending, isError, error } = useMutation<
    APIResponse,
    Error,
    { oldPassword: string; newPassword: string }
  >({
    mutationFn: changePassword,
    onSuccess: () => {
      alert("비밀번호가 성공적으로 변경되었습니다.");
      window.history.back();
    },
    onError: (error) => {
      console.error("비밀번호 수정 실패:", error);
      alert(error.message || "비밀번호 수정 중 문제가 발생했습니다.");
    },
  });

  const handleSubmit = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("모든 필드를 입력해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }
    mutate({
      oldPassword,
      newPassword,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 shadow-md rounded-md max-w-lg w-full">
        <h1 className="text-lg font-bold text-gray-700 mb-4">비밀번호 수정</h1>
        <p className="text-sm text-gray-600 mb-4">
          수정할 User ID: <span className="font-bold">{params.id}</span>
        </p>

        <div className="mb-4">
          <label
            htmlFor="currentPassword"
            className="block text-xs text-gray-600 uppercase mb-1"
          >
            현재 비밀번호
          </label>
          <input
            id="currentPassword"
            type="password"
            placeholder="현재 비밀번호"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="newPassword"
            className="block text-xs text-gray-600 uppercase mb-1"
          >
            새 비밀번호
          </label>
          <input
            id="newPassword"
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-xs text-gray-600 uppercase mb-1"
          >
            비밀번호 확인
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          {isPending ? "처리 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
