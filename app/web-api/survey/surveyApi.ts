import { SurveyQuestionMstRequest } from "@/app/types/apiTypes";
import api from "@/app/web-api/auth/api";

//설문생성
export const createSurvey = async (formData: SurveyQuestionMstRequest) => {
  const res = await api.post(`/api/survey`, formData);
  return res.data;
};

// 설문 리스트 조회
export const getCreatedSurveyList = async (
  formData: SurveyQuestionMstRequest
) => {
  const res = await api.post(`/api/survey/list`, formData, {
    params: {
      page: formData.page,
      size: formData.size,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

//설문수정
export const updateSurvey = async (formData: SurveyQuestionMstRequest) => {
  const res = await api.patch(`/api/survey`, formData);
  return res.data;
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
