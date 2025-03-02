"use client";

import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { urlConstants } from "@/app/constants/urls/group/urlConstants";
import "@/app/styles/common/Form.css";
import {useTranslation} from "react-i18next";
import {useMutation} from "@tanstack/react-query";



const GroupEditForm = ({children}: { children: React.ReactNode }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const {t} = useTranslation("group");


    // URL에서 데이터 가져오기
    const [groupData, setGroupData] = useState({
        groupCode: searchParams.get("groupCode") || "",
        groupName: searchParams.get("groupName") || "",
        groupAuthCode: searchParams.get("groupAuthCode") || "",
    });

    // 입력값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupData({
            ...groupData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        debugger
        // 수정 완료 후 다시 그룹 정보 페이지로 이동
        router.push(urlConstants.GROUP.INFO);
    };

    const handleCancel = () => {
        router.push(urlConstants.GROUP.INFO);
    };

    const updateGroup = async ({ groupId, groupData }: { groupId: string; groupData: any }) => {
        const response = await fetch(`/api/group/${groupId}`, {
            method: "PUT", // ✅ PUT 방식 사용
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(groupData),
        });

        if (!response.ok) throw new Error("그룹 수정 실패");

        return response.json();
    };

    // const { mutate, isPending, isError, isSuccess } = useMutation(updateGroup);



    return (
        <div className="form-container">
            <h2 className="form-title">{t("GROUP_EDIT_SUBJECT")}</h2>

            <div>
                <label htmlFor="groupCode" className="form-label">
                    {t("GROUP_CODE")}
                </label>
                <div
                    id="groupCode"
                    className="form-readonly"
                >{groupData.groupCode}
                </div>
            </div>

            <div>
                <label htmlFor="groupName" className="form-label">
                    {t("GROUP_NAME")}
                </label>
                <input
                    id="groupName"
                    name="groupName"
                    type="text"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    value={groupData.groupName}
                    required
                    className="form-input-full"
                />
            </div>

            <div>
                <label htmlFor="groupAuthCode" className="form-label">
                    {t("GROUP_AUTH_NUMBER")}
                </label>
                <input
                    id="groupAuthCode"
                    name="groupAuthCode"
                    type="text"
                    placeholder="Enter your name"
                    onChange={handleChange}
                    value={groupData.groupAuthCode}
                    required
                    className="form-input-full"
                />
            </div>
            <div className="form-button-center">
                {React.Children.map(children, (child, index) => {
                    if (!React.isValidElement<{ onClick?: () => void }>(child)) return child;

                    // SaveButton과 CancelButton에 각각 다른 onClick 추가
                    return React.cloneElement(child, {
                        onClick: index === 0 ? handleSave : handleCancel,
                    });
                })}
            </div>
        </div>


    );
};

export default GroupEditForm;
