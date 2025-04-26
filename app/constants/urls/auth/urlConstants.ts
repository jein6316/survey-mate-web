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
    /*로그인 이전*/
    HOME: "/",
    LOGIN: "/",
    REGISTER: "/auth/register",
    FINDIDBYEMAIL: "/auth/findIdByEmail",
    RESETPASSWORD: "/auth/resetPassword",
    USERDASHBOARD: "/dashboard/user",
    MODIFYUSER: "/dashboard/user/modifyUserInfo",
    CHANGEPASSWORD: "/dashboard/user/changePassword",
  },
};

declare global {
  var urlConstants: UrlConstantsType; // 전역 타입 명시
}
