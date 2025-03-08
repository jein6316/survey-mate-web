"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionType } from "@/app/types/questionTypes";
import Question from "@/app/component/features/survey/question/Question";
import { FaPlus } from "react-icons/fa";
import { SaveButton } from "@/app/component/button/SaveButton";
import QuestionAddButton from "@/app/component/features/survey/button/QuestionAddButton";

const CreateSurvey: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [surveyTitle, setSurveyTitle] = useState("");
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false); // 메뉴가 보이는지 상태 관리

  const questionTypes = [
    { name: "RADIO", text: "객관식 타입 추가" },
    { name: "CHECKBOX", text: "체크박스 타입 추가" },
    { name: "TEXT", text: "단답형 타입 추가" },
    { name: "TEXTAREA", text: "문장형 타입 추가" },
    { name: "NUMBER", text: "숫자 타입 추가" },
    { name: "DATE", text: "날짜 타입 추가" },
    { name: "TIME", text: "시간 타입 추가" },
    { name: "RANGE", text: "범위 타입 추가" },
  ];

  // 질문을 추가하는 함수
  const handleAddQuestion = (name: QuestionType["name"]) => {
    const newQuestion: QuestionType = {
      id: `q${questions.length + 1}`,
      name,
      question: `질문 ${questions.length + 1}`,
      options:
        name === "RADIO" || name === "CHECKBOX"
          ? ["옵션 1"] // 객관식과 체크박스는 옵션 추가
          : name === "RANGE"
          ? ["0", "100"] // RANGE 타입은 기본 최소/최대값 설정
          : undefined, // TEXT, TEXTAREA, NUMBER, DATE, TIME은 options 필요 없음
    };

    console.log("추가되는 질문:", newQuestion); // 확인용 로그
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const handleQuestionChange = (updatedQuestion: QuestionType) => {
    const updatedQuestions = questions.map((question) =>
      question.id === updatedQuestion.id ? updatedQuestion : question
    );
    setQuestions(updatedQuestions);
  };

  const handleQuestionDelete = (questionId: string) => {
    const updatedQuestions = questions.filter(
      (question) => question.id !== questionId
    );
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const surveyData = { title: surveyTitle, questions };

    try {
      // 서버로 데이터를 POST 요청
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(surveyData), // 폼 데이터를 JSON으로 변환하여 보내기
      });

      if (!response.ok) {
        throw new Error("설문 생성에 실패했습니다.");
      }

      // 응답 받은 후 설문 목록 페이지로 이동
      router.push("/survey");
    } catch (error) {
      console.error(error);
      // 오류 처리 (예: 사용자에게 알림)
    }
  };

  return (
    <div className="create-survey-container max-w-3xl mx-auto px-4">
      <h1 className="text-xl font-bold mb-4">새로운 설문지 만들기</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="survey-title">
          <label htmlFor="surveyTitle" className="block">
            설문 제목
          </label>
          <input
            type="text"
            id="surveyTitle"
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="설문 제목을 입력하세요"
          />
        </div>

        <div className="question-section">
          {questions.map((question) => (
            <Question
              key={question.id}
              question={question}
              onChange={handleQuestionChange}
              onDelete={() => handleQuestionDelete(question.id)}
            />
          ))}
        </div>

        {/* + 아이콘을 클릭하면 드롭다운 버튼이 보이도록 설정 */}
        <div className="relative inline-block">
          <button
            className="px-4 py-2 bg-gray-200 text-white rounded-full flex items-center justify-center"
            onClick={() => setShowMenu(!showMenu)} // 클릭시 드롭다운 열고 닫기
            aria-label="Add Question"
          >
            <FaPlus size={20} />
          </button>

          {/* 드롭다운 버튼들이 나타날 때 */}
          {showMenu && (
            <div className="absolute top-10 left-0 bg-white shadow-lg rounded-lg w-48 p-2 space-y-2">
              {questionTypes.map(({ name, text }) => (
                <QuestionAddButton
                  key={name}
                  name={name as any}
                  onClick={() =>
                    handleAddQuestion(name as QuestionType["name"])
                  }
                  text={text}
                />
              ))}
            </div>
          )}
        </div>

        {/* 버튼은 아래로 위치시키고, 간격을 띄운 후 가운데 정렬 */}
        <div className="mt-8 flex justify-center">
          <SaveButton>설문 생성</SaveButton>
        </div>
      </form>
    </div>
  );
};

export default CreateSurvey;
