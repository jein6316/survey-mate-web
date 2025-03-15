"use client";

import {useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { urlConstants } from "@/app/constants/urls/group/urlConstants";
import "@/app/styles/common/Form.css";
import {useTranslation} from "react-i18next";
import {useMutation, useQuery} from "@tanstack/react-query";
import {APIResponse, GroupData, ResponseError} from "@/app/types/apiTypes";
import {getGroupInfo, saveOrupdateGroupData} from "@/app/api/group/group";
import useAlert from "@/app/recoil/hooks/useAlert";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {userAtom} from "@/app/recoil/atoms/userAtom";



export const GroupEditForm = ({children}: { children: React.ReactNode }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const openAlert = useAlert();
    const { groupId } = useRecoilValue(userAtom);
    const setUser = useSetRecoilState(userAtom);
    const { t: tGroup } = useTranslation("group");
    const { t: tCommon } = useTranslation("common");
    const [title, setTitle] = useState(tGroup("GROUP_CREATE_SUBJECT"));



    const { data: groupInfoData } = useQuery({
        queryKey: ["groupInfo", searchParams.get("groupId") || ""],
        queryFn: () => getGroupInfo(groupId),
        enabled: !searchParams.has("groupId") && !!groupId
    });



    const [groupData, setGroupData] = useState<GroupData>(() => {
        if (searchParams.has("groupCode")) {
            setTitle(tGroup("GROUP_EDIT_SUBJECT"));
            return {
                groupId: searchParams.get("groupId") || "",
                groupCode: searchParams.get("groupCode") || "",
                groupName: searchParams.get("groupName") || "",
                groupAuthCode: searchParams.get("groupAuthCode") || "",
            };
        }
        return {
            groupId: "",
            groupCode: "",
            groupName: "",
            groupAuthCode: "",
        };
    });

    useEffect(()=>{
        if (groupInfoData) {
            const result = groupInfoData.data;
            setGroupData(prev => ({
                ...prev,
                groupId: result.groupId || "",
                groupCode: result.groupCode || "",
                groupName: result.groupName || "",
                groupAuthCode: result.groupAuthCode || "",
            }));
            setTitle(tGroup("GROUP_EDIT_SUBJECT"));
        }
    },[groupInfoData]);

    // 입력값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupData({
            ...groupData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = () => {
        if (!groupData.groupName.trim() ) {
            openAlert(tGroup("GROUP_NAME_REQUIRED"),"error");
            return;
        }
        if (!groupData.groupAuthCode.trim()) {
            openAlert(tGroup("GROUP_AUTH_CODE_REQUIRED"),"error");
            return;
        }
        mutate(groupData);
    };

    const handleCancel = () => {
        openAlert(tCommon("CANCELED"))
        router.push(urlConstants.GROUP.INFO);
    };




    const { data, error, isError, isPending, mutate } = useMutation<
        APIResponse,
        ResponseError,
        GroupData
    >({
        mutationFn: saveOrupdateGroupData,
        onSuccess: (data: any) => {
            setUser(prev => ({ ...prev, groupId: data.groupId }));
            openAlert(tCommon("SAVED"))
            router.push(urlConstants.GROUP.INFO);
        },
        onError: (error: ResponseError) => {
            let errorMsg = error.message;
            if(error.response){
                errorMsg = error.response?.data.message;
            }
            openAlert(tGroup("GROUP_SAVE_FAILED"),tCommon(errorMsg),"error");
        },
    });

    return (
        <div className="form-container">
            <h2 className="form-title">
                {title}
            </h2>

            {groupData.groupCode &&
                <div>
                    <label htmlFor="groupCode" className="form-label">
                        {tGroup("GROUP_CODE")}
                    </label>
                    <div
                        id="groupCode"
                        className="form-readonly"
                    >{groupData.groupCode}
                    </div>
                </div>
            }
            <div>
                <label htmlFor="groupName" className="form-label">
                    {tGroup("GROUP_NAME")}
                </label>
                <input
                    id="groupName"
                    name="groupName"
                    type="text"
                    placeholder="Enter group name"
                    onChange={handleChange}
                    value={groupData.groupName}
                    required
                    className="form-input-full"
                />
            </div>

            <div>
                <label htmlFor="groupAuthCode" className="form-label">
                    {tGroup("GROUP_AUTH_NUMBER")}
                </label>
                <input
                    id="groupAuthCode"
                    name="groupAuthCode"
                    type="text"
                    placeholder="Enter group auth code"
                    onChange={handleChange}
                    value={groupData.groupAuthCode}
                    required
                    className="form-input-full"
                />
            </div>
            <div className="form-button-two">
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

