import React from 'react';


export const SurveyFormSdtl: React.FC<SurveySdtlProps> = ({
                                                              option,
                                                              questionType,
                                                              questionId,
                                                              onResponseChange
                                                          }) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {value, type} = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
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
                    />
                );
            case "SQT004":
                return (
                    <textarea
                        id={`${questionId}-${option.questionSdtlOrder}`}
                        name={`option-${option.questionSdtlOrder}`}
                        placeholder={option.optionText}
                        onChange={handleChange}
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
                    />
                );
            case "SQT006":
                return (
                    <input
                        type="date"
                        id={`${questionId}-${option.questionSdtlOrder}`}
                        name={`option-${option.questionSdtlOrder}`}
                        onChange={handleChange}
                    />
                );
            case "SQT007":
                return (
                    <input
                        type="time"
                        id={`${questionId}-${option.questionSdtlOrder}`}
                        name={`option-${option.questionSdtlOrder}`}
                        onChange={handleChange}
                    />
                );
            case "SQT008":
                return (
                    <input
                        type="range"
                        id={`${questionId}-${option.questionSdtlOrder}`}
                        name={`option-${option.questionSdtlOrder}`}
                        min="1"
                        max="10"
                        onChange={handleChange}
                    />
                );
            case "SQT009":
                return (
                    <select id={`${questionId}-${option.questionSdtlOrder}`}
                            name={`option-${option.questionSdtlOrder}`}
                            onChange={handleChange}
                    >
                        {option.optionText.split(',').map((text, index) => (
                            <option key={index} value={text.trim()}>
                                {text.trim()}
                            </option>
                        ))}
                    </select>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            {renderInputType()}
            <label htmlFor={`${questionId}-${option.questionSdtlOrder}`}>{option.optionText}</label>
        </div>
    );
};
