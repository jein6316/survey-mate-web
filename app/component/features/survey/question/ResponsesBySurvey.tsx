"use client";

import {Card, CardContent} from "@/app/component/common/list/Card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/app/component/common/list/Table";
import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getResponsesBySurvey} from "@/app/api/survey/surveyApi";
import {useStatusHandler} from "@/app/hooks/useStatusHandler";
import {useRouter, useSearchParams} from "next/navigation";
import {Pagination} from "@/app/component/common/page/Pagination";

export interface ResponsesBySurvey {
    srMstId: number;
    createData: string;
    createMemNum: string;
    userId: string;
    userName: string;
}


export const ResponsesBySurvey = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const searchParams = useSearchParams();
    const router = useRouter();

    const {data, isLoading, error} = useQuery({
        queryKey: ["responses", currentPage], // Query key
        queryFn: () => {
            return getResponsesBySurvey(searchParams.get("sqMstId") || "", currentPage)
        }
    });

    useStatusHandler(isLoading, error, "survey");

    const responses: ResponsesBySurvey[] = data?.data.content || [];
    const pageData = data?.data;
    const handlePageChange = (page: number) => {
        setCurrentPage(page); // 페이지 변경
    };

    const handleRowClick = (srMstId: number) => {
        router.push(`/survey/response?srMstId=${srMstId}&prevPage=list`);
    };

    const createFormattedDate = (createdAtArray: number[]): string => {
        if (!createdAtArray) return "";
        const createdAt = new Date(
            createdAtArray[0],   // 연도
            createdAtArray[1] - 1, // 월 (0-based)
            createdAtArray[2],   // 일
            createdAtArray[3],   // 시
            createdAtArray[4],   // 분
            createdAtArray[5],   // 초
            createdAtArray[6]    // 밀리초
        );

        // 원하는 형식으로 변환 (예: 2025년 4월 7일 21시 37분)
        return `${createdAt.getFullYear()}년 ${createdAt.getMonth() + 1}월 ${createdAt.getDate()}일 ${String(createdAt.getHours())}시 ${String(createdAt.getMinutes())}분`;
    };

    return (
        <div className="p-6 space-y-4">

            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>생성일시</TableHead>
                                <TableHead>생성자ID</TableHead>
                                <TableHead>생성자이름</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {responses.map((response: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <span onClick={() => handleRowClick(response.srMstId)} style={{cursor: 'pointer'}}>
                                            {createFormattedDate(response.createData)}
                                        </span>
                                    </TableCell>
                                    <TableCell>{response.userId}</TableCell>
                                    <TableCell>{response.userName}</TableCell>
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
        </div>
    );
}
