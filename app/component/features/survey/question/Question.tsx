"use cleint";
import React, { useState } from "react";
import { QuestionType } from "@/app/types/questionTypes";
import Checkbox from "./Checkbox";
import DateInput from "./DateInput";
import CheckboxInput from "./Checkbox";
import NumberInput from "./Number";
import RadioInput from "./RadioInput";
import RangeInput from "./RangeInput";
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import TimeInput from "./TimeInput";

interface QuestionProps {
  question: QuestionType;
  onDelete: () => void;
  onChange: (updatedQuestion: QuestionType) => void;
}

const Question: React.FC<QuestionProps> = ({
  question,
  onDelete,
  onChange,
}) => {
  const handleChangeQuestion = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...question, question: e.target.value });
  };

  // 옵션 변경
  const handleOptionChange = (index: number, option: string) => {
    const updatedOptions = [...(question.options || [])];
    updatedOptions[index] = option;
    onChange({ ...question, options: updatedOptions });
  };

  // 옵션 추가
  const handleAddOption = () => {
    const updatedOptions = [...(question.options || []), ""]; // 빈 옵션 추가
    onChange({ ...question, options: updatedOptions });
  };

  // 옵션 삭제
  const handleRemoveOption = (index: number) => {
    const updatedOptions =
      question.options?.filter((_, i) => i !== index) || [];
    onChange({ ...question, options: updatedOptions });
  };
  // 타입별로 렌더링할 컴포넌트 매핑
  const renderInputComponent = () => {
    switch (question.name) {
      case "CHECKBOX":
        return <CheckboxInput question={question} onChange={onChange} />;
      case "DATE":
        return <DateInput question={question} />;
      case "NUMBER":
        return <NumberInput question={question} />;
      case "RADIO":
        return <RadioInput question={question} onChange={onChange} />;
      case "RANGE":
        return <RangeInput question={question} onChange={onChange} />;
      case "TEXT":
        return <TextInput question={question} />;
      case "TEXTAREA":
        return <TextAreaInput question={question} />;
      case "TIME":
        return <TimeInput question={question} />;
      default:
        return null; // 기본적으로 아무것도 렌더링하지 않음
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 max-w-xl mx-auto">
      {" "}
      {/* max-w-xl로 너비 제한 */}
      <input
        type="text"
        value={question.question}
        onChange={handleChangeQuestion}
        placeholder="질문을 입력하세요"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <div className="mb-4">{renderInputComponent()}</div>
      {/* 옵션 추가 버튼 */}
      <button onClick={onDelete} className="text-red-500 mt-4">
        삭제
      </button>
    </div>
  );
};

export default Question;
