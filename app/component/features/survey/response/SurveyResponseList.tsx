"use client";

import "@/app/styles/common/List.css";
import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getSurveyResponseList} from "@/app/web-api/surveyResponse/SurveyResponseApi";
import {useStatusHandler} from "@/app/hooks/useStatusHandler";
import {Pagination} from "@/app/component/common/page/Pagination";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/navigation";
import {Card, CardContent} from "@/app/component/common/list/Card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/app/component/common/list/Table";

export interface SurveyResponse {
    rowNumber: number;
    sqMstId: string;
    title: string;
    description: string;
    surveyUrl: string;
    completed: boolean;
    srMstId: number;
}


export const SurveyResponseList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const {t} = useTranslation("surveyResponse");
    const router = useRouter();

    const {data, isLoading, error} = useQuery({
        queryKey: ["responseList", currentPage], // Query key
        queryFn: () => {
            return getSurveyResponseList(currentPage)
        }
    });

    useStatusHandler(isLoading, error, "surveyResponse");

    const responses: SurveyResponse[] = data?.data.content || [];
    const pageData = data?.data;
    const handlePageChange = (page: number) => {
        setCurrentPage(page); // 페이지 변경
    };

    const handleRowClick = (surveyUrl: string, srMstId: number) => {
        router.push(`/survey/response?surveyUrl=${surveyUrl}&srMstId=${srMstId}&prevPage=list`);
    };


    return (
        <div className="p-6 space-y-4">
            <h2 className="list-title">{t("SURVEY_RESPONSE_LIST")}</h2>
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">{t("SUBJECT")}</TableHead>
                                <TableHead>{t("DESCRIPTION")}</TableHead>
                                <TableHead>{t("STATUS")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {responses.map((response) => (
                                <TableRow key={response.sqMstId}>
                                    <TableCell className="list-clickable px-4 py-2"
                                    ><span onClick={() => handleRowClick(response.surveyUrl, response.srMstId)}>{response.title}</span>
                                    </TableCell>
                                    <TableCell style={{textAlign: "left"}}> {response.description}</TableCell>
                                    <TableCell className="list-hidden-column">{response.surveyUrl}</TableCell>
                                    <TableCell>{response.completed ? t("COMPLETED") : t("NOT_COMPLETED")}</TableCell>
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
