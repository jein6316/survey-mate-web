// RangeInput.tsx
import React, { useEffect, useState } from "react";
import { QuestionType } from "@/app/types/questionTypes";

interface RangeInputProps {
  question: QuestionType;
  onChange: (updatedQuestion: QuestionType) => void;
}

const RangeInput: React.FC<RangeInputProps> = ({ question, onChange }) => {
  // 처음 진입 시 min, max 기본값 세팅
  const [min, setMin] = useState<number>(() => {
    const range = question.options?.[0]?.split("-");
    return range ? Number(range[0]) : 0;
  });
  const [max, setMax] = useState<number>(() => {
    const range = question.options?.[0]?.split("-");
    return range ? Number(range[1]) : 100;
  });

  // 처음 마운트되었을 때 onChange로 초기값 반영
  useEffect(() => {
    const updatedOption = `${min}-${max}`;
    onChange({
      ...question,
      options: [updatedOption],
    });
  }, []);

  // 최소값 변경 핸들러
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = Number(e.target.value);
    setMin(newMin);
    onChange({ ...question, min: newMin });
  };

  // 최대값 변경 핸들러
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = Number(e.target.value);
    setMax(newMax);
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
            value={min}
            onChange={handleMinChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>

        {/* 최대값 입력 */}
        <div className="flex flex-col">
          <label className="text-sm">최대값</label>
          <input
            type="number"
            value={max}
            onChange={handleMaxChange}
            className="p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default RangeInput;
