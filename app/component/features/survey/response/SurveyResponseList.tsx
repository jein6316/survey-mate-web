"use client";

import "@/app/styles/common/List.css";
import React, {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getSurveyResponseList} from "@/app/api/surveyResponse/SurveyResponseApi";
import {useStatusHandler} from "@/app/hooks/useStatusHandler";
import {Pagination} from "@/app/component/common/page/Pagination";
import {useTranslation} from "react-i18next";
import {useRouter} from "next/navigation";

export interface SurveyResponse {
    rowNumber: number;
    sqMstId: string;
    title: string;
    description: string;
    surveyUrl: string;
    completed: boolean;
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

    const handleRowClick = (surveyUrl: string) => {
        router.push(`/survey/response?surveyUrl=${surveyUrl}&prevPage=list`);
    };


    return (
        <div className="list-container">
            <h2 className="list-title">{t("SURVEY_RESPONSE_LIST")}</h2>
            <br/>
            <table>
                <thead>
                <tr>
                    <th style={{width: "30%"}}>{t("SUBJECT")}</th>
                    <th style={{width: "60%"}}>{t("DESCRIPTION")}</th>
                    <th style={{width: "10%"}}>{t("STATUS")}</th>

                    <th className="list-hidden-column"></th>
                </tr>
                </thead>
                <tbody>
                {responses.map((response) => (
                    <tr key={response.sqMstId}>
                        <td className="list-clickable"
                            onClick={() => handleRowClick(response.surveyUrl)}
                        >{response.title}</td>
                        <td style={{textAlign: "left"}}> {response.description}</td>
                        <td className="list-hidden-column">{response.surveyUrl}</td>
                        <td>{response.completed ? t("COMPLETED") : t("NOT_COMPLETED")}</td>
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

}
