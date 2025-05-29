"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionType } from "@/app/types/questionTypes";
import Question from "@/app/component/features/survey/question/Question";
import { FaPlus } from "react-icons/fa";
import { SaveButton } from "@/app/component/button/SaveButton";
import QuestionAddButton from "@/app/component/features/survey/button/QuestionAddButton";
import { useMutation } from "@tanstack/react-query";
import { APIResponse, SurveyQuestionMstRequest } from "@/app/types/apiTypes";
import { createSurvey } from "@/app/web-api/survey/surveyApi";
import useAlert from "@/app/recoil/hooks/useAlert";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/app/recoil/atoms/userAtom";
import { DatePicker } from "@/app/component/common/list/DatePicker";
import { formatDateStartEndDate } from "@/app/utils/formatter";

export default function CreateSurvey() {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [surveyTitle, setSurveyTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [surveyDescription, setSurveyDescription] = useState("");
  const { groupId } = useRecoilValue(userAtom); // 그룹 ID
  // 상단 상태 추가
  const [isGroupSurvey, setIsGroupSurvey] = useState<"Y" | "N">("N");
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false); // 메뉴가 보이는지 상태 관리
  const openAlert = useAlert();
  const questionTypes = [
    { typeId: "SQT001", name: "RADIO", text: "객관식 타입 추가" },
    { typeId: "SQT002", name: "CHECKBOX", text: "체크박스 타입 추가" },
    { typeId: "SQT003", name: "TEXT", text: "단답형 타입 추가" },
    { typeId: "SQT004", name: "TEXTAREA", text: "문장형 타입 추가" },
    { typeId: "SQT005", name: "NUMBER", text: "숫자 타입 추가" },
    { typeId: "SQT006", name: "DATE", text: "날짜 타입 추가" },
    { typeId: "SQT007", name: "TIME", text: "시간 타입 추가" },
    { typeId: "SQT008", name: "RANGE", text: "범위 타입 추가" },
  ];

  // API 호출 로직
  const { data, error, isError, isPending, mutate } = useMutation<
    APIResponse,
    Error,
    SurveyQuestionMstRequest
  >({
    mutationFn: createSurvey,
    onSuccess: (data: any) => {
      if (data.result) {
        openAlert(
          "설문 생성 완료",
          "설문이 성공적으로 생성되었습니다.",
          "info",
          () => {
            router.push("/survey/question/list");
          }
        );
      }
    },
    onError: (error: Error) => {
      openAlert("설문 생성중 오류가 발생하였습니다", "error");
    },
  });

  // 질문을 추가하는 함수
  const handleAddQuestion = (
    name: QuestionType["name"],
    typeId: QuestionType["typeId"]
  ) => {
    const newQuestion: QuestionType = {
      id: `q${questions.length + 1}`,
      typeId,
      question: `질문 ${questions.length + 1}`,
      options:
        typeId === "RADIO" || typeId === "CHECKBOX"
          ? ["옵션 1"]
          : typeId === "RANGE"
          ? ["0", "100"]
          : undefined,
      name: name as any,
      min: typeId === "RANGE" ? 0 : undefined,
    };
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

    // SurveyQuestionMstRequest 형식으로 변환
    const surveyData: SurveyQuestionMstRequest = {
      title: surveyTitle,
      startDate: startDate
        ? formatDateStartEndDate(startDate, false)
        : undefined, // 시작일을 ISO 문자열로 변환
      endDate: endDate ? formatDateStartEndDate(endDate, true) : undefined, // 종료일을 ISO 문자열로 변환
      description: surveyDescription, // 설명은 필요에 따라 추가
      questions: questions.map((question) => ({
        typeId: question.typeId,
        questionText: question.question,
        options: question.options?.map((option, index) => ({
          optionText: option, // 옵션 텍스트
          questionSdtlOrder: index + 1, // 옵션 순서를 숫자로 변환
        })),
      })),
      groupId: isGroupSurvey == "Y" ? groupId : undefined, // 그룹 설문 여부
    };
    if (isValid()) {
      mutate(surveyData);
    }
  };

  const isValid = () => {
    if (!surveyTitle || !surveyDescription) {
      openAlert(
        "필수 입력값이 누락되었습니다.",
        "설문 제목과 설명을 입력해주세요.",
        "warning"
      );
      return false;
    }

    if (questions.length === 0) {
      openAlert("질문이 없습니다.", "질문을 추가해주세요.", "warning");

      return false;
    }

    for (const question of questions) {
      if (!question.question || question.question.trim() === "") {
        openAlert(
          "질문이 비어있습니다.",
          `"${question.question}" 질문을 입력해주세요.`,
          "warning"
        );
        return false;
      }

      // 옵션이 필요한 타입인데 옵션이 없거나 빈 항목만 있는 경우
      const needsOptions = ["SQT001", "SQT002"]; // 객관식, 체크박스 타입
      if (needsOptions.includes(question.typeId)) {
        if (
          !question.options ||
          question.options.length === 0 ||
          question.options.every((opt) => opt.trim() === "")
        ) {
          openAlert(
            "옵션이 비어있습니다.",
            `"${question.question}" 질문에 옵션을 추가해주세요.`,
            "warning"
          );
          return false;
        }
      }
      if (question.typeId === "SQT008") {
        const { min, max } = question;
        if (
          typeof min !== "number" ||
          typeof max !== "number" ||
          isNaN(min) ||
          isNaN(max)
        ) {
          openAlert(
            "범위값이 잘못되었습니다.",
            `"${question.question}" 질문의 최소값과 최대값을 올바르게 입력해주세요.`,
            "warning"
          );
          return false;
        }

        if (min >= max) {
          openAlert(
            "범위값이 올바르지 않습니다.",
            `"${question.question}" 질문에서 최소값은 최대값보다 작아야 합니다.`,
            "warning"
          );
          return false;
        }
      }
    }

    return true;
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
        <div className="flex items-center gap-2">
          <label htmlFor="startDate" className="block">
            설문 시작일
          </label>
          <DatePicker
            value={startDate}
            onChange={setStartDate}
            placeholder="시작일"
          />
          <label htmlFor="endDate" className="block">
            설문 종료일
          </label>
          <DatePicker
            value={endDate}
            onChange={setEndDate}
            placeholder="종료일"
          />
        </div>
        <div className="survey-description">
          <label htmlFor="surveyDescription" className="block">
            설문 설명
          </label>
          <textarea
            id="surveyDescription"
            value={surveyDescription}
            onChange={(e) => setSurveyDescription(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="설문 설명을 입력하세요"
          />
        </div>
        {/* 그룹 설문 생성 여부 */}
        <div className="survey-groupId">
          <label htmlFor="isGroupSurvey" className="block">
            그룹 설문 생성 여부
          </label>
          <select
            id="isGroupSurvey"
            value={isGroupSurvey}
            onChange={(e) => setIsGroupSurvey(e.target.value as "Y" | "N")}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="Y">Y (그룹 설문)</option>
            <option value="N">N (일반 설문)</option>
          </select>
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
            type="button"
          >
            <FaPlus size={20} />
          </button>

          {/* 드롭다운 버튼들이 나타날 때 */}
          {showMenu && (
            <div className="absolute top-10 left-0 bg-white shadow-lg rounded-lg w-48 p-2 space-y-2">
              {questionTypes.map(({ typeId, name, text }) => (
                <QuestionAddButton
                  key={name}
                  name={name as any}
                  onClick={() =>
                    handleAddQuestion(name as QuestionType["name"], typeId)
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
}
