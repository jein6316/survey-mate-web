import React, {useEffect, useState} from 'react';


export const SurveyFormSdtl: React.FC<SurveySdtlProps> = ({
                                                              option,
                                                              questionType,
                                                              questionId,
                                                              respondedValue,
                                                              hasResponded,
                                                              onResponseChange
                                                          }) => {

    const [rangeSelectedValue,setRangeSelectedValue ] = useState("");

    useEffect(()=>{
        if(questionType === "SQT008"){
            if(respondedValue && respondedValue.length > 0){
                setRangeSelectedValue(respondedValue[0]);
            }
        }
    },[questionType, respondedValue])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {value, type} = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

        if (type === "range") {
            setRangeSelectedValue(value);
        }
        if (type === "checkbox") {
            const {checked} = e.target as HTMLInputElement;
            onResponseChange(questionId, value, type, checked);
        } else {
            onResponseChange(questionId, value, type, null);
        }

    };

    const renderInputType = () => {

        switch (questionType) {
            case "SQT001":
                return (
                    <input
                        type="radio"
                        id={`${questionId}-${option.questionSdtlOrder}`}
                        name={`option-${questionId}`}
                        value={option.questionSdtlOrder}
                        onChange={handleChange}
                        disabled={hasResponded}
                        // checked={respondedValue.includes(String(option.questionSdtlOrder))}
                        {...(hasResponded && {checked: respondedValue.includes(String(option.questionSdtlOrder))})}
                    />
                );
            case "SQT002":
                return (
                    <input
                        type="checkbox"
                        id={`${questionId}-${option.questionSdtlOrder}`}
                        value={option.questionSdtlOrder}
                        name={`option-${questionId}`}
                        multiple
                        onChange={handleChange}
                        disabled={hasResponded}
                        {...(hasResponded && {checked: respondedValue.includes(String(option.questionSdtlOrder))})}
                    />
                );
            case "SQT003":
                return (
                    <input
                        type="text"
                        id={`${questionId}-${option.questionSdtlOrder}`}
                        name={`option-${option.questionSdtlOrder}`}
                        placeholder={option.optionText}
                        onChange={handleChange}
                        className={"survey-option-singleLineText"}
                        disabled={hasResponded}
                        {...(hasResponded && {value: respondedValue[0]})}
                    />
                );
            case "SQT004":
                return (
                    <textarea
                        id={`${questionId}-${option.questionSdtlOrder}`}
                        name={`option-${option.questionSdtlOrder}`}
                        placeholder={option.optionText}
                        onChange={handleChange}
                        className={"survey-option-multiLineText"}
                        disabled={hasResponded}
                        {...(hasResponded && {value: respondedValue[0]})}
                    />
                );
            case "SQT005":
                return (
                    <input
                        type="number"
                        id={`${questionId}-${option.questionSdtlOrder}`}
                        name={`option-${option.questionSdtlOrder}`}
                        placeholder={option.optionText}
                        onChange={handleChange}
                        className={"survey-option-numberInput"}
                        disabled={hasResponded}
                        {...(hasResponded && {value: respondedValue[0]})}
                    />
                );
            case "SQT006":
                return (
                    <input
                        type="date"
                        id={`${questionId}-${option.questionSdtlOrder}`}
                        name={`option-${option.questionSdtlOrder}`}
                        onChange={handleChange}
                        disabled={hasResponded}
                        {...(hasResponded && {value: respondedValue[0]})}
                    />
                );
            case "SQT007":
                return (
                    <input
                        type="time"
                        id={`${questionId}-${option.questionSdtlOrder}`}
                        name={`option-${option.questionSdtlOrder}`}
                        onChange={handleChange}
                        disabled={hasResponded}
                        {...(hasResponded && {value: respondedValue[0]})}
                    />
                );
            case "SQT008":
                return (
                    <div className={"survey-option-range"}>
                        <input
                            type="range"
                            id={`${questionId}-${option.questionSdtlOrder}`}
                            name={`option-${option.questionSdtlOrder}`}
                            min={option.optionText.split("-")[0]}
                            max={option.optionText.split("-")[1]}
                            onChange={handleChange}
                            disabled={hasResponded}
                            value={rangeSelectedValue}
                            className={"survey-option-range"}
                        />
                        <p>{rangeSelectedValue}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {renderInputType()}
            {questionType === "SQT003" || questionType === "SQT004" || questionType === "SQT005" || questionType === "SQT008" ? null : (
                <label htmlFor={`${questionId}-${option.questionSdtlOrder}`}>{option.optionText}</label>
            )}
        </div>
    );
};
