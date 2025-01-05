type UrlConstantsType = {
  pages: {
    HOME: string;
    LOGIN: string;
    REGISTER: string;
    USERDASHBOARD: string;
    MODIFYUSER: string;
    FINDIDBYEMAIL: string;
    CHANGEPASSWORD: string;
    RESETPASSWORD: string;
  };
};

export const urlConstants: UrlConstantsType = {
  pages: {
    HOME: "/",
    LOGIN: "/pages/auth/login",
    REGISTER: "/pages/auth/register",
    USERDASHBOARD: "/pages/dashboard/user",
    MODIFYUSER: "/pages/dashboard/user/modify",
    FINDIDBYEMAIL: "/pages/main/findIdByEmail",
    RESETPASSWORD: "/pages/main/resetPassword",
    CHANGEPASSWORD: "/pages/dashboard/user/changePassword",
  },
};

declare global {
  var urlConstants: UrlConstantsType; // 전역 타입 명시
}
