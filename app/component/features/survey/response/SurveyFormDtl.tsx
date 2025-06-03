import React, {useEffect, useState} from 'react';
import {SurveyFormSdtl} from './SurveyFormSdtl';


export const SurveyFormDtl: React.FC<SurveyDtlProps> = ({
                                                            hasResponded,
                                                            question,
                                                            onResponseChange
                                                        }) => {

    const getInitialRangeValue = () => {
        if (question.typeId === "SQT008") {
            const sortedOptions = [...question.options].sort((a, b) => a.questionSdtlOrder - b.questionSdtlOrder);
            const minValue = parseInt(sortedOptions[0]?.optionText, 10);

            if (question.respondedValue !== null && typeof question.respondedValue === 'number') {
                return question.respondedValue;
            }
            // 응답이 없거나 유효하지 않은 경우, min 값으로 초기화
            return !isNaN(minValue) ? minValue : 0; // 기본값 0 (또는 다른 적절한 값)
        }
        return 0; // SQT008이 아닐 때의 기본값 (실제로는 사용되지 않음)
    };

    const [currentRangeDisplayValue, setCurrentRangeDisplayValue] = useState<number>(getInitialRangeValue());

    useEffect(() => {
        // 부모로부터 받은 question.respondedValue가 변경되면 currentRangeDisplayValue도 업데이트
        setCurrentRangeDisplayValue(getInitialRangeValue());
    }, [question.respondedValue, question.options, question.typeId]);


    if(question.typeId === "SQT008"){
        if (!question.options || question.options.length < 2) {
            console.error(`Range question (ID: ${question.questionDtlOrder}) is missing min/max options.`);
            return <div className="survey-question-container">오류: 범위 질문 설정이 올바르지 않습니다.</div>;
        }

        const sortedOptions = [...question.options].sort((a, b) => a.questionSdtlOrder - b.questionSdtlOrder);
        const minOptionText = sortedOptions[0].optionText;
        const maxOptionText = sortedOptions[1].optionText;

        const minValue = parseInt(minOptionText, 10);
        const maxValue = parseInt(maxOptionText, 10);


        if (isNaN(minValue) || isNaN(maxValue)) {
            console.error(`Invalid min/max values for range question (ID: ${question.questionDtlOrder}). Min: ${minOptionText}, Max: ${maxOptionText}`);
            return <div className="survey-question-container">오류: 범위 값이 숫자가 아닙니다.</div>;
        }

        const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = parseInt(event.target.value, 10);
            setCurrentRangeDisplayValue(newValue); // UI 즉시 업데이트
            onResponseChange(question.questionDtlOrder, newValue.toString(), question.typeId, null);
        };

        return (
            <div className="survey-question-container">
                <h3 className="survey-question-title">{question.questionText}</h3>
                <div className="survey-option-container survey-option-range-wrapper"> {/* Wrapper 클래스 추가 가능 */}
                    <div className={"survey-option-range"}>
                        <input
                            type="range"
                            id={`${question.questionDtlOrder}-range`}
                            name={`option-range-${question.questionDtlOrder}`}
                            min={minValue}
                            max={maxValue}
                            onChange={handleRangeChange}
                            disabled={hasResponded}
                            value={currentRangeDisplayValue}
                            className={"survey-option-range"}
                        />
                        <p className="range-value-display">{currentRangeDisplayValue}</p> {/* 선택된 값 표시 */}
                    </div>
                </div>
            </div>
        );
    }
    else{
        return (
            <div className="survey-question-container">
                <h3 className="survey-question-title">{question.questionText}</h3>
                <div className="survey-option-container">
                    {question.options.map((option, index) => (
                        <SurveyFormSdtl key={index}
                                        option={option}
                                        questionType={question.typeId}
                                        questionId={question.questionDtlOrder}
                                        respondedValue={question.respondedValue == null ? [] : question.respondedValue}
                                        hasResponded={hasResponded}
                                        onResponseChange={onResponseChange}
                        />
                    ))}
                </div>
            </div>
        );
    }

};

