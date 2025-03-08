// TextInput.tsx
import React from "react";
import { QuestionType } from "@/app/types/questionTypes";
interface TextInputProps {
  question: QuestionType;
}

const TextInput: React.FC<TextInputProps> = ({ question }) => {
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

export default TextInput;
