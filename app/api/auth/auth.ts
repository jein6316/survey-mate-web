import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  APIResponse,
  LoginResponseData,
  LoginFormData,
  HandleSubmitParams,
  modifyMemberPayload,
  verCodeResponseData,
  RegisterFormData,
} from "@/app/types/apiTypes";
import Cookies from "js-cookie";

/**************************
auth 관련 API
***************************/

//로그인
// 로그인 요청 함수
export const loginSubmit = async (formData: LoginFormData) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data; // 서버 응답 데이터 반환
};

//회원가입
export const registerSubmit = async (formData: RegisterFormData) => {
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
};

//아이디중복체크
export const checkDuplicateIdAPI = async (
  userId: string
): Promise<APIResponse> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-duplicate-id`,
    {
      params: { userId }, // GET 요청의 쿼리 파라미터로 전달
    }
  );
  return res.data; // boolean 값 반환
};

// 이메일인증
export const checkUserEmailAPI = async (email: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-verification-code`,
    {
      params: { email }, // GET 요청의 쿼리 파라미터로 전달
    }
  );
  return response.data; // 서버에서 성공 여부 반환 (boolean)
};

// 아이디 찾기
export const findIdByEmailAPI = async (email: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/findIdByEmail`,
    {
      params: { email }, // GET 요청의 쿼리 파라미터로 전달
    }
  );
  return response.data; // 서버에서 성공 여부 반환 (boolean)
};

//비밀번호 수정
