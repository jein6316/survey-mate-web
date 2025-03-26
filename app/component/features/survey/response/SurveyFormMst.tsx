"use client"

import React, {useEffect, useState} from 'react';
import "@/app/styles/survey/survey-form.css";
import {SurveyFormDtl} from './SurveyFormDtl';
import {useQuery} from "@tanstack/react-query";
import {getSurveyForm} from "@/app/api/surveyResponse/SurveyResponseApi";
import {useStatusHandler} from "@/app/hooks/useStatusHandler";
import {SurveySubmitButton} from "@/app/component/features/survey/button/SurveySubmitButton";



export const SurveyFormMst = () => {

    const [surveyData, setSurveyData] = useState<SurveyMstProps>({
        sqMstId: "",
        title: "",
        description: "",
        questions: [],
    });

    const [responses, setResponses] = useState<SurveyResponse[]>([]);

    const {data, isLoading, error} = useQuery({
        queryKey: ["surveyFormId", surveyData.sqMstId], // Query key
        queryFn: () => {
            return getSurveyForm("test012345")
        }
    });

    useStatusHandler(isLoading, error, "survey");
    useEffect(() => {
        if (data?.data) {
            console.log(data.data.questions);
            setSurveyData(data.data);
        }
    }, [data]);

    const handleResponseChange = (questionId: number, value: string, type: string, checked: boolean | null) => {
        setResponses((prevResponses) => {

            let response = prevResponses;
            const updatedResponses = prevResponses.filter(
                (response) => response.questionId !== questionId
            );
            if(type === "checkbox"){
                let prevCheckedList = response.find((response) => response.questionId === questionId);

                if(prevCheckedList) {
                    if (checked) {
                        if (!prevCheckedList.answer.includes(value)) {
                            prevCheckedList.answer.push(value);
                        }
                    } else {
                        prevCheckedList.answer = prevCheckedList.answer.filter((item) => item !== value);
                    }
                }else if(checked){
                    response.push({questionId, answer:[value]});
                }
            }else{
                response = [...updatedResponses, {questionId, answer:[value]}];
            }
            console.log(response);
            return response;
        });
    };

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
                <SurveySubmitButton/>
            </div>
        </div>
    );
};

