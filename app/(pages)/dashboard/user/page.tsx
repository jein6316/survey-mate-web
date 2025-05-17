"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMemberInfoAPI } from "app/api/auth/member";
import Image from "next/image";
import { LogoutButton } from "@/app/component/button/LogoutButton";
import { useTranslation } from "react-i18next";
import { useStatusHandler } from "@/app/hooks/useStatusHandler";

export default function User() {
  const { t } = useTranslation("dashboard");
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
    queryKey: ["memberInfo", userId],
    queryFn: getMemberInfoAPI,
  });

  useEffect(() => {
    if (data) {
      const result = data.data;
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
    router.push(urlConstants.pages.MODIFYUSER);
  };
  const handleResetPassowrd = () => {
    router.push(urlConstants.pages.CHANGEPASSWORD);
  };

  useStatusHandler(isLoading, error, "dashboard");

  return (
    <div className="bg-white mt-10 p-8 shadow-md rounded-md max-w-lg w-full">
      <h2 className="text-lg font-bold text-gray-700 mb-4">{t("USER_INFO")}</h2>
      <h1 className="text-sm text-gray-600">
        <span className="font-bold">{t("USER_ID")}</span> {userData.userId}
      </h1>
      <h1 className="text-sm text-gray-600">
        <span className="font-bold">{t("USER_NAME")}</span> {userData.userName}
      </h1>
      <h1 className="text-sm text-gray-600">
        <span className="font-bold">{t("USER_EMAIL")}</span>{" "}
        {userData.userEmail}
      </h1>
      <h1 className="text-sm text-gray-600">
        <span className="font-bold">{t("JOIN_DATE")}</span> {userData.joinDate}
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
        {t("MODIFY_USER_INFO")}
      </button>
      <button
        onClick={handleResetPassowrd}
        className="mt-4 w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600"
      >
        {t("MODIFY_USER_PASSWORD")}
      </button>
      <LogoutButton></LogoutButton>
    </div>
  );
}
