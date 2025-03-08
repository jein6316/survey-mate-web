"use client";

import React, {useEffect, useState} from "react";
import "@/app/styles/common/View.css";
import {useQuery} from "@tanstack/react-query";
import {getGroupInfo} from "@/app/api/group/group";
import useAlert from "@/app/recoil/hooks/useAlert";
import {useTranslation} from "react-i18next";
import {GroupData} from "@/app/types/apiTypes";
import {getUserFromToken} from "@/app/recoil/hooks/useUser";
import {useRouter} from "next/navigation";
import {urlConstants} from "@/app/constants/urls/group/urlConstants";
import {useStatusHandler} from "@/app/hooks/useStatusHandler";

export const GroupInfoView = ({children}: { children: React.ReactNode }) => {
    const {t} = useTranslation("group");
    const openAlert = useAlert();
    const {groupId} = getUserFromToken();
    const router = useRouter();


    const [groupData, setGroupData] = useState<GroupData>({
        groupId: groupId || "",
        groupCode: "",
        groupName: "",
        groupAuthCode: "",
    });

    const {data, isLoading, error} = useQuery({
        queryKey: ["groupInfo", groupData.groupCode], // Query key
        queryFn: () => {
            if (!groupId) {
                openAlert(t("GROUP_NOT_FOUND"), "error");
                return;
            }
            return getGroupInfo(groupId)
        },
        enabled: !!groupId
    });

    useStatusHandler(isLoading, error, "group");


    const handleEdit = () => {
        const queryString = new URLSearchParams(Object.fromEntries(Object.entries(groupData))).toString();
        router.push(`${urlConstants.GROUP.EDIT}?${queryString}`);
    }

    useEffect(() => {
        if (data) {
            const result = data.data; // API 응답 데이터
            setGroupData({
                groupId: groupId || "",
                groupCode: result.groupCode || "",
                groupName: result.groupName || "",
                groupAuthCode: result.groupAuthCode || "",
            });
        }
    }, [data]);

    return (
        <div className="view-container">
            <div className="view-title">{t("GROUP_INFO")}</div>

            <div className="view-field">
                <span className="view-bold">{t("GROUP_CODE")}</span>
                <span className="view-bold">{groupData.groupCode}</span>
            </div>

            <div className="view-field">
                <span className="view-bold">{t("GROUP_NAME")}</span>
                <span className="view-bold">{groupData.groupName}</span>
            </div>

            <div className="view-field">
                <span className="view-bold">{t("GROUP_AUTH_NUMBER")}</span>
                <span className="view-bold">{groupData.groupAuthCode}</span>
            </div>

            <div className="view-button-one">
                {/*{children}*/}
                {React.cloneElement(children as React.ReactElement, { onClick: handleEdit })}
            </div>
        </div>
    );
};
