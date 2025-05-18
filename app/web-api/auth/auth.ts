import axios from "axios";
import {
  APIResponse,
  LoginFormData,
  RegisterFormData,
} from "@/app/types/apiTypes";

/**************************
auth 관련 API
***************************/

//로그인
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
  return res.data;
};

//회원가입
export const registerSubmit = async (formData: RegisterFormData) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

//아이디중복체크
export const checkDuplicateIdAPI = async (
  userId: string
): Promise<APIResponse> => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-duplicate-id`,
    {
      params: { userId },
    }
  );
  return res.data;
};
// 이메일인증
export const checkUserEmailAPI = async (email: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-verification-code`,
    {
      params: { email },
    }
  );
  return response.data;
};

// 아이디 찾기
export const findIdByEmailAPI = async (email: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/findIdByEmail`,
    {
      params: { email },
    }
  );
  return response.data;
};

//비밀번호 리셋
export const restPasswordAPI = async (email: string) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/findIdByEmail`,
    {
      params: { email },
    }
  );
  return response.data;
};
//구글 로그인
export const loginGoogleAPI = async (token: string) => {
  const response = await axios.post(
    "http://localhost:8080/api/auth/oauth/google",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
