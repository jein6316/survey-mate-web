import axios from "axios";
import { MenuItem, SurveyQuestionMstRequest } from "@/app/types/apiTypes";
import api from "@/app/api/auth/api";

//설문생성
export const createSurvey = async (formData: SurveyQuestionMstRequest) => {
  const res = await api.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/survey`, // 엔드포인트 URL
    formData, // FormData 객체를 전송
    {}
  );
  return res.data; // 성공 시 data 포함 반환
};
