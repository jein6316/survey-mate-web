"use cleint";
import React, { useState } from "react";
import { QuestionType } from "@/app/types/questionTypes";

interface CheckboxInputProps {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  question,
  onChange,
}) => {
  // 옵션을 추가하고 삭제하는 함수들
  const [options, setOptions] = useState<string[]>(question.options || []);
  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
    // 부모 컴포넌트로 변경된 질문 데이터 전달
    onChange({ ...question, options: updatedOptions });
  };

  const handleAddOption = () => {
    setOptions([...options, ""]); // 새로운 빈 옵션 추가
    onChange({ ...question, options: [...options, ""] });
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    onChange({ ...question, options: updatedOptions });
  };

  return (
    <div className="question-container border border-gray-300 rounded-lg p-4 mb-4">
      <label className="question-label block text-lg font-semibold mb-2">
        {question.question}
      </label>
      <div className="options space-y-2">
        {options.map((option, index) => (
          <div key={index} className="option flex items-center space-x-2">
            <input
              type="radio"
              id={`${question.id}_option_${index}`}
              name={question.id}
              value={option}
              disabled
            />
            <input
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
              placeholder={`옵션 ${index + 1}`}
            />
            <button
              type="button"
              onClick={() => handleRemoveOption(index)}
              className="text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAddOption}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
      >
        + 옵션 추가
      </button>
    </div>
  );
};

export default CheckboxInput;
