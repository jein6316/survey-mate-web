type UrlConstantsType = {
  pages: {
    HOME: string;
    LOGIN: string;
    REGISTER: string;
    USERDASHBOARD: (userId: string) => string;
    MODIFYUSER: string;
  };
};

export const urlConstants: UrlConstantsType = {
  pages: {
    HOME: "/",
    LOGIN: "/pages/auth/login",
    REGISTER: "/pages/auth/register",
    USERDASHBOARD: (userId: string) => `/pages/dashboard/user`,
    MODIFYUSER: "/pages/dashboard/user/modify",
  },
};

declare global {
  var urlConstants: UrlConstantsType; // 전역 타입 명시
}
