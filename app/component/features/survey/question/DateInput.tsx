// Date.tsx
"use cleint";
import React from "react";
import { QuestionType } from "@/app/types/questionTypes";
interface DateInputProps {
  question: QuestionType;
}

const DateInputQuestion: React.FC<DateInputProps> = ({ question }) => {
  return (
    <div className="question-container">
      <label className="question-label">{question.question}</label>
      <input
        type="date"
        id={question.id}
        name={question.id}
        placeholder="Your answer here"
        className="w-full p-2 border border-gray-300 rounded"
        required
      />
    </div>
  );
};

export default DateInputQuestion;
