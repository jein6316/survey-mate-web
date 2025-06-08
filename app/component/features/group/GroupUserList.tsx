"use client";

import "@/app/styles/common/List.css";
import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getGroupMembers} from "@/app/web-api/group/group";
import {getUserFromToken} from "@/app/recoil/hooks/useUser";
import useAlert from "@/app/recoil/hooks/useAlert";
import {useTranslation} from "react-i18next";
import {useStatusHandler} from "@/app/hooks/useStatusHandler";
import {Pagination} from "@/app/component/common/page/Pagination";
import {Card, CardContent} from "@/app/component/common/list/Card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/app/component/common/list/Table";

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
        <div className="p-6 space-y-4">
            <h2 className="list-title">{tGroup("GROUP_USERS")}</h2>
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>{tCommon("NAME")}</TableHead>
                                <TableHead>{tCommon("ROLE")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.userId}>
                                    <TableCell className="px-4 py-2">{user.userId}</TableCell>
                                    <TableCell>{user.userName}</TableCell>
                                    <TableCell>{tCommon(user.memRole)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

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
        </div>)
    ;
};
