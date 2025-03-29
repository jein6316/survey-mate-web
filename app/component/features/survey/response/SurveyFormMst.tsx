"use client"

import React, {useEffect, useState} from 'react';
import "@/app/styles/survey/survey-form.css";
import {SurveyFormDtl} from './SurveyFormDtl';
import {useMutation, useQuery} from "@tanstack/react-query";
import {getSurveyForm, saveSurveyResponse} from "@/app/api/surveyResponse/SurveyResponseApi";
import {useStatusHandler} from "@/app/hooks/useStatusHandler";
import {SurveySubmitButton} from "@/app/component/features/survey/button/SurveySubmitButton";
import {APIResponse, GroupData, ResponseError} from "@/app/types/apiTypes";
import useAlert from "@/app/recoil/hooks/useAlert";
import {useSearchParams} from "next/navigation";


export const SurveyFormMst = () => {

    const openAlert = useAlert();
    const searchParams = useSearchParams();

    const [surveyData, setSurveyData] = useState<SurveyMstProps>({
        sqMstId: "",
        title: "",
        description: "",
        questions: [],
    });

    const [responses, setResponses] = useState<SurveyResponse[]>([]);

    const {data : queryData, isLoading, error : queryError} = useQuery({
        queryKey: ["surveyUrl", searchParams.get("surveyUrl") || ""], // Query key
        queryFn: () => {
            const surveyUrl = searchParams.get("surveyUrl");
            return getSurveyForm(surveyUrl || "")
        }
    });

    useStatusHandler(isLoading, queryError, "surveyResponse");

    useEffect(() => {
        if (queryData?.data) {
            const newResponses = queryData.data.questions.map((question: SurveyQuestionDtlResponse) => ({
                questionId: question.questionDtlOrder,
                answer: []
            }));
            setResponses(newResponses);
            setSurveyData(queryData.data);
        }
    }, [queryData]);

    const handleResponseChange = (questionId: number, value: string, type: string, checked: boolean | null) => {
        setResponses((prevResponses) => {
            let prevData = prevResponses.find((response) => response.questionId === questionId);
            if(!prevData){
                prevData = {questionId:questionId, answer:[]};
            }

            if(type === "checkbox"){
                if (checked) {
                    if(!prevData.answer.includes(value)) {
                        prevData.answer.push(value);
                    }
                }else{
                    prevData.answer = prevData.answer.filter((item) => item !== value);
                }
            }else{
                prevData.answer = [value];
            }
            console.log(prevResponses);
            return prevResponses;
        });
    };

    const handleSave = () => {
        const emptyResponse = responses.filter((item: SurveyResponse) => item.answer.length == 0);
        if(emptyResponse && emptyResponse.length > 0) {
            const ids = emptyResponse.map(item => item.questionId).join(',');
            openAlert("응답하지 않은 항목이 있습니다. : "+ids);
            return;
        }
        mutate({sqMstId:surveyData.sqMstId, surveyResponse:responses});
    };

    const { data, error , isError, isPending, mutate } = useMutation<
        APIResponse,
        ResponseError,
        {sqMstId: string, surveyResponse:SurveyResponse[]}
    >({
        mutationFn: saveSurveyResponse,
        onSuccess: (data: any) => {
        },
        onError: (error: ResponseError) => {
            let errorMsg = error.message;
            if(error.response){
                errorMsg = error.response?.data.message;
            }
            openAlert("SAVE FAILED",errorMsg,"error");
        },
    });

    return (
        <div className="survey-form-container">
            <h2 className="survey-form-title">{surveyData.title}</h2>
            {surveyData && surveyData.questions.length > 0 ? (
                surveyData.questions.map((question, index) => (
                    <div className="survey-form-question" key={index}>
                        <SurveyFormDtl question={question} onResponseChange={handleResponseChange}/>
                    </div>
                ))
            ) : (
                <div>No response available.</div> // 질문이 없을 경우 처리
            )}
            <div className="flex justify-center">
                <SurveySubmitButton onClick={handleSave}/>
            </div>
        </div>
    );
};

