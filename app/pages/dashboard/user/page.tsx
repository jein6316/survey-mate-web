"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMemberInfoAPI } from "app/api/auth/member";
import Image from "next/image";
import { APIResponse } from "@/app/types/apiTypes";
import { LogoutButton } from "@/app/component/button/LogoutButton";
export default function User() {
  const [userId, setUserId] = useState("");

  const normalizePath = (path: string) => {
    return path.replace(/\\/g, "/");
  };

  const [userData, setUserData] = useState({
    userId: "",
    userName: "",
    userEmail: "",
    profileImageUri: "",
    joinDate: "",
    memStatus: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["memberInfo", userId], // Query key
    queryFn: getMemberInfoAPI, // API 호출 함수
  });
  // 데이터가 변경되면 상태 업데이트
  useEffect(() => {
    if (data) {
      const result = data.data; // API 응답 데이터
      const test = normalizePath(result.profileImageUri);
      setUserData({
        userId: result.userId || "",
        userName: result.userName || "",
        userEmail: result.userEmail || "",
        profileImageUri: test || "",
        joinDate: result.joinDate || "",
        memStatus: result.memStatus || "",
      });
    }
  }, [data]);

  const router = useRouter();

  const handleEditClick = () => {
    // 회원정보 수정 페이지로 이동
    router.push(urlConstants.pages.MODIFYUSER);
  };
  const handleResetPassowrd = () => {
    // 회원정보 수정 페이지로 이동
    router.push(urlConstants.pages.CHANGEPASSWORD);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러 발생: {error.message}</div>;
  }

  return (
    <div className="bg-white mt-10 p-8 shadow-md rounded-md max-w-lg w-full">
      <h2 className="text-lg font-bold text-gray-700 mb-4">User Information</h2>
      <h1 className="text-sm text-gray-600">
        <span className="font-bold">User ID:</span> {userData.userId}
      </h1>
      <h1 className="text-sm text-gray-600">
        <span className="font-bold">User Name:</span> {userData.userName}
      </h1>
      <h1 className="text-sm text-gray-600">
        <span className="font-bold">User Email:</span> {userData.userEmail}
      </h1>
      <h1 className="text-sm text-gray-600">
        <span className="font-bold">Join Date:</span> {userData.joinDate}
      </h1>
      <h1 className="text-sm text-gray-600">
        <span className="font-bold">Membership Status:</span>{" "}
        {userData.memStatus}
      </h1>
      {/*}<div className="mt-4">
        {userData.profileImageUri ? (
          <img
            src={userData.profileImageUri}
            alt="Profile Image"
            className="rounded-md w-full"
          />
        ) : (
          <p className="text-gray-500">프로필 이미지가 없습니다.</p>
        )}
      </div>*/}
      <button
        onClick={handleEditClick}
        className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
      >
        회원정보수정버튼
      </button>
      <button
        onClick={handleResetPassowrd}
        className="mt-4 w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600"
      >
        비밀번호수정버튼
      </button>
    </div>
  );
}
