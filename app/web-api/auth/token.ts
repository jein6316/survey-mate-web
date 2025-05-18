import axios from "axios";
//토큰 갱신 함수
export const refreshToken = async () => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};
