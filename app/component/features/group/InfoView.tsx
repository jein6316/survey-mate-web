"use client";

import React, { useEffect, useState } from "react";
import "@/app/styles/common/View.css";
import { useQuery } from "@tanstack/react-query";
import { getGroupInfoAPI } from "@/app/api/group/group";
import useAlert from "@/app/recoil/hooks/useAlert";
import { useTranslation } from "react-i18next";
import { ResponseError } from "@/app/types/apiTypes";

export const InfoView = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation("group");
  const openAlert = useAlert();

  const [groupData, setGroupData] = useState({
    groupCode: "",
    groupName: "",
    groupAuthCode: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["groupInfo", groupData.groupCode], // Query key
    queryFn: getGroupInfoAPI, // API 호출 함수
  });

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
      <div className="view-title">그룹 정보</div>
      <div className="view-field">
        <span className="view-bold">그룹 코드</span>
        <span className="view-bold">{groupData.groupCode}</span>
      </div>

      <div className="view-field">
        <span className="view-bold">그룹 이름</span>
        <span className="view-bold">{groupData.groupName}</span>
      </div>

      <div className="view-field">
        <span className="view-bold">그룹 코드</span>
        <span className="view-bold">{groupData.groupAuthCode}</span>
      </div>
    </div>
  );
};
