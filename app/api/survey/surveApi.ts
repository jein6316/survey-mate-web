import axios from "axios";
import { MenuItem } from "@/app/types/apiTypes";
import api from "@/app/api/auth/api";

//설문생성
/*export const createSurvey = async (formData: RegisterFormData) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, // 엔드포인트 URL
      formData, // FormData 객체를 전송
      {
        headers: {
          "Content-Type": "multipart/form-data", // 요청 헤더에 Content-Type 설정
        },
      }
    );
    return res.data; // 성공 시 data 포함 반환
  };*/
