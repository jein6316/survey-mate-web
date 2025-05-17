import { MenuItem } from "@/app/types/apiTypes";
import api from "@/app/api/auth/api";

//권한별 레이아웃 메뉴 불러오기
export const getMenusByRole = async (memRole: string) => {
  const res = await api.get(`/api/menu/getMenusByRole/${memRole}`);
  return res.data;
};
