import axios from "axios";
import { MenuItem } from "@/app/types/apiTypes";
import api from "@/app/api/auth/api";

//메뉴생성
export const createMenu = async (formData: MenuItem) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/menu/createMenu`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data; // 서버 응답 데이터 반환
};

//모든 메뉴 조회

//권한별 메뉴 조회
export const fin = async (formData: MenuItem) => {
  const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/menu/createMenu`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data; // 서버 응답 데이터 반환
};
//메뉴 수정

//메뉴 삭제

//권한별 레이아웃 메뉴 불러오기
export const getMenusByRole = async (memRole: string) => {
  const res = await api.get(`/api/menu/getMenusByRole/${memRole}`);
  return res.data;
};
