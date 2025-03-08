import React from "react";

interface QuestionAddButtonProps {
  name:
    | "RADIO"
    | "CHECKBOX"
    | "TEXT"
    | "TEXTAREA"
    | "NUMBER"
    | "DATE"
    | "TIME"
    | "RANGE";
  onClick: () => void;
  text: string;
}

const QuestionAddButton: React.FC<QuestionAddButtonProps> = ({
  name,
  onClick,
  text,
}) => {
  // 각 버튼의 배경 색을 타입에 맞게 설정
  const getButtonColor = (
    name:
      | "RADIO"
      | "CHECKBOX"
      | "TEXT"
      | "TEXTAREA"
      | "NUMBER"
      | "DATE"
      | "TIME"
      | "RANGE"
  ) => {
    switch (name) {
      case "RADIO":
        return "bg-blue-500 hover:bg-blue-600";
      case "CHECKBOX":
        return "bg-green-500 hover:bg-green-600";
      case "TEXTAREA":
        return "bg-indigo-500 hover:bg-indigo-600";
      case "TEXT":
        return "bg-purple-500 hover:bg-purple-600"; // 텍스트 유형의 버튼 색상
      case "NUMBER":
        return "bg-yellow-500 hover:bg-yellow-600"; // 숫자 유형의 버튼 색상
      case "DATE":
        return "bg-red-500 hover:bg-red-600"; // 날짜 유형의 버튼 색상
      case "TIME":
        return "bg-orange-500 hover:bg-orange-600"; // 시간 유형의 버튼 색상
      case "RANGE":
        return "bg-teal-500 hover:bg-teal-600"; // 범위(Range) 유형의 버튼 색상
      default:
        return "bg-gray-500 hover:bg-gray-600"; // 기본 색상
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 text-white rounded-full ${getButtonColor(
        name
      )}`}
    >
      {text}
    </button>
  );
};

export default QuestionAddButton;
