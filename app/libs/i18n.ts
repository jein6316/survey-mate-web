import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  fallbackLng: "ko", // 기본 언어 설정
  interpolation: { escapeValue: false },
  ns: ["common", "auth", "group"], // 사용할 네임스페이스 목록
  defaultNS: "common", // 기본 네임스페이스 (설정 안 하면 common을 기본으로 사용)
  resources: {
    en: {
      common: require("@/app/utils/locales/common/en.json"),
      dashboard: require("@/app/utils/locales/dashboard/en.json"),
      auth: require("@/app/utils/locales/auth/en.json"),
      group: require("@/app/utils/locales/group/en.json"),
      survey: require("@/app/utils/locales/survey/en.json"),
      surveyResponse: require("@/app/utils/locales/surveyResponse/en.json"),
    },
    ko: {
      common: require("@/app/utils/locales/common/ko.json"),
      dashboard: require("@/app/utils/locales/dashboard/ko.json"),
      auth: require("@/app/utils/locales/auth/ko.json"),
      group: require("@/app/utils/locales/group/ko.json"),
      survey: require("@/app/utils/locales/survey/ko.json"),
      surveyResponse: require("@/app/utils/locales/surveyResponse/ko.json"),
    },
  },
});

export default i18n;
