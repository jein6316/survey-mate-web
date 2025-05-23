import { SurveyQuestionMstRequest } from "@/app/types/apiTypes";
import api from "@/app/web-api/auth/api";

//설문생성
export const createSurvey = async (formData: SurveyQuestionMstRequest) => {
  const res = await api.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/survey`, // 엔드포인트 URL
    formData, // FormData 객체를 전송
    {}
  );
  return res.data; // 성공 시 data 포함 반환
};

// 설문 리스트 조회
export const getCreatedSurveyList = async (
  formData: SurveyQuestionMstRequest
) => {
  const res = await api.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/survey/list`, // 엔드포인트 URL
    formData, // requestBody
    {
      params: {
        // requestParam을 쿼리 파라미터로 전달
        page: formData.page,
        size: formData.size,
      },
      headers: {
        "Content-Type": "application/json", // 필요에 따라 헤더 추가
      },
    }
  );
  return res.data; // 성공 시 data 포함 반환
};

//설문수정
export const updateSurvey = async (formData: SurveyQuestionMstRequest) => {
  const res = await api.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/survey`, // 엔드포인트 URL
    formData, // FormData 객체를 전송
    {}
  );
  return res.data; // 성공 시 data 포함 반환
};

export const getResponsesBySurvey = async (
  sqMstId: string,
  currentPage: number
) => {
  const response = await api.get(`/api/survey/${sqMstId}/responses`, {
    params: { page: currentPage - 1, size: 10 },
  });
  return response.data;
};
