"use client";

import {useRouter} from "next/navigation";
import {useState, useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {getMemberInfoAPI} from "@/app/web-api/auth/member";
import {LogoutButton} from "@/app/component/button/LogoutButton";
import {useTranslation} from "react-i18next";
import {useStatusHandler} from "@/app/hooks/useStatusHandler";

export default function User() {
    const router = useRouter();
    const {t} = useTranslation("dashboard");

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
        groupName: "",
        groupId: "",
    });

    const {data, isLoading, error} = useQuery({
        queryKey: ["memberInfo", userData.userId],
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
                groupName: result.groupName || "",
                groupId: result.groupId || "",
            });
        }
    }, [data]);

    const handleEditClick = () => {
        router.push(urlConstants.pages.MODIFYUSER);
    };
    const handleResetPassowrd = () => {
        router.push(urlConstants.pages.CHANGEPASSWORD);
    };

    const handleJoinGroupClick = () => {
        router.push(urlConstants.pages.MODIFYUSER);
    };
    const handleCreateGroupClick = () => {
        router.push(urlConstants.pages.GROUPCREATE);
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
            {userData.groupId &&
                <h1 className="text-sm text-gray-600">
                    <span className="font-bold">{t("USER_GROUP")}</span> {userData.groupName}
                </h1>
            }

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

            {!userData.groupId &&
                <div className="mt-4 flex w-full gap-1">
                    <button
                        onClick={handleJoinGroupClick}
                        className="w-1/2 bg-blue-400 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        {t("JOIN_GROUP")}
                    </button>

                    <button
                        onClick={handleCreateGroupClick}
                        className="w-1/2 bg-blue-400 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        {t("CREATE_GROUP")}
                    </button>
                </div>
            }

            <button
                onClick={handleEditClick}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
                {t("MODIFY_USER_INFO")}
            </button>

            <button
                onClick={handleResetPassowrd}
                className="mt-1 mb-1 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
                {t("MODIFY_USER_PASSWORD")}
            </button>
            <LogoutButton></LogoutButton>
        </div>
    );
}
