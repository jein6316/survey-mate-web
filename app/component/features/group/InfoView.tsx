"use client";

import React, {useEffect, useState} from "react";
import "@/app/styles/common/View.css";
import {useQuery} from "@tanstack/react-query";
import {fetchGroupInfo} from "@/app/api/group/group";
import useAlert from "@/app/recoil/hooks/useAlert";
import {useTranslation} from "react-i18next";
import {ResponseError} from "@/app/types/apiTypes";
import {getUserFromToken} from "@/app/recoil/hooks/useUser";
import useLoading from "@/app/recoil/hooks/useLoading";

export const InfoView = ({children}: { children: React.ReactNode }) => {
    const {t} = useTranslation("group");
    const openAlert = useAlert();
    const {groupId} = getUserFromToken();
    const {setLoadingState, clearLoadingState} = useLoading();


    const [groupData, setGroupData] = useState({
        groupCode: "",
        groupName: "",
        groupAuthCode: "",
    });

    const {data, isLoading, error} = useQuery({
        queryKey: ["groupInfo", groupData.groupCode], // Query key
        queryFn: () => {
            if (!groupId) {
                openAlert(t("GROUP_NOT_FOUND"), "error");
                throw new Error("GROUP_NOT_FOUND");
            }
            return fetchGroupInfo(groupId)
        }
    });

    if(isLoading){
        setLoadingState();
    }else{
        clearLoadingState();
    }

    if (error) {
        let msg = (error as ResponseError).message;
        if ((error as ResponseError).response) {
            msg = (error as ResponseError).response?.data?.message || msg;
        }
        openAlert(t(msg), "error");
    }

    useEffect(() => {
        if (data) {
            const result = data.data; // API 응답 데이터
            setGroupData({
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

            <div className="view-button-middle">
                {children}
            </div>
        </div>
    );
};
