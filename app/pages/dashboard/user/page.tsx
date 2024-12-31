"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMemberInfoAPI } from "app/api/auth/member";
import Image from "next/image";
import { APIResponse } from "@/app/types/apiTypes";
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
      debugger;
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

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러 발생: {error.message}</div>;
  }

  return (
    <div>
      <h1>User ID: {userData.userId}</h1>
      <h1>userName: {userData.userName}</h1>
      <h1>userEmail: {userData.userEmail}</h1>
      <h1>joinDate: {userData.joinDate}</h1>
      <h1>memStatus: {userData.memStatus}</h1>
      <div>
        {userData.profileImageUri ? (
          <Image
            src={`/${userData.profileImageUri}`}
            alt="Profile Image"
            width={500} // 이미지의 너비
            height={300} // 이미지의 높이
          />
        ) : (
          <p>프로필 이미지가 없습니다.</p>
        )}
      </div>
      <button onClick={handleEditClick}>회원정보수정버튼</button>
    </div>
  );
}
