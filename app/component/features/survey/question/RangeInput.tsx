// RangeInput.tsx
import React, { useState } from "react";
import { QuestionType } from "@/app/types/questionTypes";

interface RangeInputProps {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
}

const RangeInput: React.FC<RangeInputProps> = ({ question, onChange }) => {
  // 최소값 변경 핸들러
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    onChange({ ...question, min: newMin });
  };

  // 최대값 변경 핸들러
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    onChange({ ...question, max: newMax });
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 mb-4 max-w-xl mx-auto">
      <label className="block font-semibold mb-2">{question.question}</label>
      <div className="flex gap-4">
        {/* 최소값 입력 */}
        <div className="flex flex-col">
          <label className="text-sm">최소값</label>
          <input
            type="number"
            value={question.min ?? 0}
            onChange={handleMinChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        {/* 최대값 입력 */}
        <div className="flex flex-col">
          <label className="text-sm">최대값</label>
          <input
            type="number"
            value={question.max ?? 100}
            onChange={handleMaxChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default RangeInput;
