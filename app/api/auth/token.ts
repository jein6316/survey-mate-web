import axios from "axios";
import {
  LoginResponseData,
  LoginFormData,
  HandleSubmitParams,
} from "@/app/types/apiTypes";
import Cookies from "js-cookie";
import { useMutation, useQuery } from "@tanstack/react-query";

//토큰 갱신 함수
export const refreshToken = async () => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`
    );
    return res.data;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    throw error; // 리프레시 실패 시 로그인 페이지로 리다이렉트
  }
};
