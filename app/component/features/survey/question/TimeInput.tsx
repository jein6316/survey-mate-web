// TimeInput.tsx
import React from "react";
import { QuestionType } from "@/app/types/questionTypes";
interface TimeInputProps {
  question: QuestionType;
}

const TimeInput: React.FC<TimeInputProps> = ({ question }) => {
  return (
    <div className="question-container">
      <label className="question-label">{question.question}</label>
      <input
        type="time"
        id={question.id}
        name={question.id}
        placeholder="Your answer here"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
    </div>
  );
};

export default TimeInput;
