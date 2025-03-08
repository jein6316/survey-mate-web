"use client";

import "@/app/styles/common/List.css";
import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getGroupMembers} from "@/app/api/group/group";
import {getUserFromToken} from "@/app/recoil/hooks/useUser";
import useAlert from "@/app/recoil/hooks/useAlert";
import {useTranslation} from "react-i18next";
import {useStatusHandler} from "@/app/hooks/useStatusHandler";
import {Pagination} from "@/app/component/common/page/Pagination";

// types.ts
export interface User {
    groupId: number;
    userId: string;
    userName: string;
    userEmail: string;
    memRole: "USER" | "MANAGER";
    joinDate: string;
    socialType: string;
    memStatus: "ACTIVE" | "INACTIVE";
}


export const GroupUserList = () => {
    const openAlert = useAlert();
    const {groupId} = getUserFromToken();
    const {t : tCommon} = useTranslation();
    const {t : tGroup} = useTranslation("group");

    const [currentPage, setCurrentPage] = useState(1);


    const {data, isLoading, error} = useQuery({
        queryKey: ["groupMembers", currentPage], // Query key
        queryFn: () => {
            if (!groupId) {
                openAlert(tGroup("GROUP_NOT_FOUND"), "error");
                return;
            }
            return getGroupMembers(groupId, currentPage)
        },
        enabled: !!groupId
    });

    useStatusHandler(isLoading, error, "group");

    const users: User[] = data?.data.content || [];
    const pageData = data?.data;

    const handlePageChange = (page: number) => {
        setCurrentPage(page); // 페이지 변경
    };

    return (
        <div className="list-container">
            <h2 className="list-title">{tGroup("GROUP_USERS")}</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>{tCommon("NAME")}</th>
                    <th>{tCommon("ROLE")}</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.userId}>
                        <td>{user.userId}</td>
                        <td>{user.userName}</td>
                        <td>{tCommon(user.memRole)}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            {pageData && (
                <Pagination
                    currentPage={pageData.currentPage}
                    totalPages={pageData.totalPages}
                    totalElements={pageData.totalElements}
                    first={pageData.first}
                    last={pageData.last}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};
