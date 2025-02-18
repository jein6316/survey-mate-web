import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    ko: {
      translation: require("@/app/utils/locales/ko.json"),
    },
    en: {
      translation: require("@/app/utils/locales/en.json"),
    },
  },
  lng: "ko",
  fallbackLng: "ko",
  interpolation: { escapeValue: false },
});

export default i18n;
