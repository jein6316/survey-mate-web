import React from 'react';
import {SurveyFormSdtl} from './SurveyFormSdtl';


export const SurveyFormDtl: React.FC<SurveyDtlProps> = ({
                                                            hasResponded,
                                                            question,
                                                            onResponseChange
                                                        }) => {

    return (
        <div className="survey-question-container">
            <h3 className="survey-question-title">{question.questionText}</h3>
            <div className="survey-option-container">
                {question.options.map((option) => (
                    <SurveyFormSdtl key={option.questionSdtlOrder}
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
};

