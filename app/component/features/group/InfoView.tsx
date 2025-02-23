"use client";


import React from "react";
import "@/app/styles/common/Form.css";

export const InfoView = ({
                             children,
                         }: {
    children: React.ReactNode;
}) => {

    const handleModify = async (e: React.FormEvent) => {
        e.preventDefault();

    };

    return (
        <form onSubmit={handleModify} autoComplete="off" className="form-container">
            <h2 className="form-title">그룹 정보</h2>
            <div>
                <label htmlFor="groupCode" className="form-label">
                    그룹 코드
                </label>
                <div id="groupCode" className="form-readonly"
                > 그룹코드
                </div>
            </div>
            <div>
                <label htmlFor="groupName" className="form-label">
                    그룹 이름
                </label>
                <div id="groupName" className="form-info-read"
                > 그룹 이름
                </div>
            </div>
            <div>
                <label htmlFor="groupAuthCode" className="form-label">
                    그룹 인증 번호
                </label>
                <div id="groupAuthCode" className="form-info-read"
                > 그룹 인증 번호
                </div>
            </div>
            {children}
        </form>);
};
