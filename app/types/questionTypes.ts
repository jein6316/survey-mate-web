export type QuestionType = {
  id: string;
  typeId: string; // 질문 유형 ID
  name:
    | "RADIO"
    | "CHECKBOX"
    | "TEXT"
    | "TEXTAREA"
    | "NUMBER"
    | "DATE"
    | "TIME"
    | "RANGE";
  question: string;
  options?: string[]; // 객관식이나 체크박스 질문에만 사용
  min?: number;
  max?: number;
};
