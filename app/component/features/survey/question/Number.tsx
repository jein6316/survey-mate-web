// NumberInput.tsx
import React from "react";
import { QuestionType } from "@/app/types/questionTypes";
interface NumberInputProps {
  question: QuestionType;
}

const NumberInput: React.FC<NumberInputProps> = ({ question }) => {
  return (
    <div className="question-container">
      <label className="question-label">{question.question}</label>
      <textarea
        id={question.id}
        name={question.id}
        placeholder="Your answer here"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
    </div>
  );
};

export default NumberInput;
