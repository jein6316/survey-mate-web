interface SurveyMstProps {
    sqMstId: string;
    title: string;
    description: string;
    hasResponded: boolean;
    questions: SurveyQuestionDtlResponse[];
}

interface SurveyResponse {
    questionId: number;
    answer: string[];
}

interface SurveyQuestionDtlResponse {
    questionDtlOrder: number; // 질문 순서
    questionText: string; // 질문 내용
    typeId: string; // 질문 유형 ID
    options: SurveyQuestionSdtlResponse[]; // 선택지 목록
    respondedValue: any[];
}

interface SurveyDtlProps {
    hasResponded: boolean;
    question: SurveyQuestionDtlResponse;
    onResponseChange: (questionId: number, value: string, type: string, checked: boolean | null) => void;
}


interface SurveyQuestionSdtlResponse {
    questionSdtlOrder: number; // 선택지 순서
    optionText: string; // 선택지 내용
}


interface SurveySdtlProps {
    questionType: string;
    option: SurveyQuestionSdtlResponse;
    questionId: number;
    respondedValue: any[];
    hasResponded: boolean;
    onResponseChange: (questionId: number, value: string, type: string, checked: boolean | null) => void;
}

