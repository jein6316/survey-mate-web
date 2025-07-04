"use client"

import React, {useEffect, useState} from 'react';
import "@/app/styles/survey/survey-form.css";
import {SurveyFormDtl} from './SurveyFormDtl';
import {useMutation, useQuery} from "@tanstack/react-query";
import {getSurveyForm, saveSurveyResponse} from "@/app/web-api/surveyResponse/SurveyResponseApi";
import {useStatusHandler} from "@/app/hooks/useStatusHandler";
import {SurveySubmitButton} from "@/app/component/features/survey/button/SurveySubmitButton";
import {APIResponse, ResponseError} from "@/app/types/apiTypes";
import useAlert from "@/app/recoil/hooks/useAlert";
import {useRouter, useSearchParams} from "next/navigation";
import {useTranslation} from "react-i18next";
import {urlConstants} from "@/app/constants/urls/surveyResponse/urlConstants";


export const SurveyFormMst = () => {

    const openAlert = useAlert();
    const searchParams = useSearchParams();
    const router = useRouter();
    const {t: tSurveyResponse} = useTranslation("surveyResponse");

    const [surveyData, setSurveyData] = useState<SurveyMstProps>({
        sqMstId: "",
        title: "",
        description: "",
        hasResponded: false,
        startDate: "",
        endDate: "",
        questions: [],
    });

    const [responses, setResponses] = useState<SurveyResponse[]>([]);

    const {data: queryData, isLoading, error: queryError} = useQuery({
        queryKey: ["surveyUrl", searchParams.get("surveyUrl") || ""], // Query key
        queryFn: () => {
            const surveyUrl = searchParams.get("surveyUrl");
            const srMstIdParam = searchParams.get("srMstId");
            const srMstId = (!srMstIdParam || srMstIdParam === "null") ? null : srMstIdParam;
            return getSurveyForm(surveyUrl || "", srMstId || "")
        }
    });

    useStatusHandler(isLoading, queryError, "surveyResponse");

    useEffect(() => {
        if (queryData?.data) {

            if(isFutureDateTime(queryData?.data.startDate)){
                openAlert(tSurveyResponse("SURVEY_NOT_STARTED"),"warning");
                router.push(urlConstants.SURVEY_RESPONSE.LIST);
                return;
            }

            const processedData = getProcessedSurveyData(queryData?.data);
            if (!processedData) return;
            setSurveyData(processedData);

            if (responses.length === 0) {
                const newResponses = processedData.questions.map((q) => ({
                    questionId: q.questionDtlOrder,
                    answer: q.respondedValue || [],
                }));
                setResponses(newResponses);
            }

            const now = new Date();
            const endDate = new Date(processedData.endDate);
            const isExpired = now > endDate && !queryData.data.hasResponded;
            const prevPage = searchParams.get("prevPage");

            if (isExpired) {
                openAlert(tSurveyResponse("SURVEY_EXPIRED"),"warning");
            }
            else if (!prevPage && queryData.data.hasResponded) {
                openAlert(tSurveyResponse("SURVEY_ALREADY_RESPONDED"), "info");
            }
        }
    }, [queryData]);

    const isFutureDateTime = (dateTimeString: string): boolean => {
        const now = new Date();
        const targetDateTime = new Date(dateTimeString);
        return targetDateTime > now;
    };

    const getProcessedSurveyData = (originalData: SurveyMstProps | undefined) => {
        if (!originalData) return null;

        // 원본을 수정하지 않기 위해 복사본 생성
        const processedData = { ...originalData };
        const now = new Date();
        const endDate = new Date(processedData.endDate);

        // 기간이 만료되었고, 아직 응답하지 않은 설문이라면
        if (now > endDate && !processedData.hasResponded) {
            // 복사본의 hasResponded 값을 true로 변경
            processedData.hasResponded = true;
        }

        return processedData;
    };


    const handleResponseChange = (questionId: number, value: string, type: string, checked: boolean | null) => {
        setResponses((prevResponses) => {
            let prevData = prevResponses.find((response) => response.questionId === questionId);
            if (!prevData) {
                prevData = {questionId: questionId, answer: []};
            }

            if (type === "checkbox") {
                if (checked) {
                    if (!prevData.answer.includes(value)) {
                        prevData.answer.push(value);
                    }
                } else {
                    prevData.answer = prevData.answer.filter((item) => item !== value);
                }
            } else {
                prevData.answer = [value];
            }
            return prevResponses;
        });
    };

    const handleSave = () => {
        const emptyResponse = responses.filter((item: SurveyResponse) => item.answer.length == 0);
        if (emptyResponse && emptyResponse.length > 0) {
            const ids = emptyResponse.map(item => item.questionId).join(',');
            openAlert("응답하지 않은 항목이 있습니다. : " + ids);
            return;
        }
        mutate({sqMstId: surveyData.sqMstId, surveyResponse: responses});
    };

    const {data, error, isError, isPending, mutate} = useMutation<
        APIResponse,
        ResponseError,
        { sqMstId: string, surveyResponse: SurveyResponse[] }
    >({
        mutationFn: saveSurveyResponse,
        onSuccess: (data: any) => {
            openAlert(tSurveyResponse("SURVEY_SUBMIT_SUCCESS"), "info");
            router.push(urlConstants.SURVEY_RESPONSE.LIST);
        },
        onError: (error: ResponseError) => {
            let errorMsg = error.message;
            if (error.response) {
                errorMsg = error.response?.data.message;
            }
            openAlert("SAVE FAILED", errorMsg, "error");
        },
    });

    return (
        <div className="survey-form-container">
            <h2 className="survey-form-title">{surveyData.title}</h2>
            {surveyData && surveyData.questions.length > 0 ? (
                surveyData.questions.map((question, index) => (
                    <div className="survey-form-question" key={index}>
                        <SurveyFormDtl hasResponded={surveyData.hasResponded}
                                       question={question}
                                       onResponseChange={handleResponseChange}/>
                    </div>
                ))
            ) : (
                <div>No response available.</div> // 질문이 없을 경우 처리
            )}
            {!surveyData || surveyData.questions.length == 0 || surveyData.hasResponded ? null : (
                <div className="flex justify-center">
                    <SurveySubmitButton onClick={handleSave}/>
                </div>
            )}

        </div>
    );
};

