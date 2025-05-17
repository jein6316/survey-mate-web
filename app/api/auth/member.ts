import {
  modifyMemberPayload,
  changePasswordResData,
} from "@/app/types/apiTypes";
import api from "@/app/api/auth/api";

/**************************
    member  API
***************************/

//회원정보수정
export const modifyMemberAPI = async (formData: modifyMemberPayload) => {
  const response = await api.patch("/api/member/modify", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

//회원정보조회
export const getMemberInfoAPI = async () => {
  const response = await api.get("/api/member/getMemInfo");
  return response.data;
};

//비밀번호수정
export const changePassword = async (formData: changePasswordResData) => {
  const response = await api.patch("/api/member/change-password", formData);
  return response.data;
};
