type UrlConstantsType = {
  HOME: string;
  SURVEY_RESPONSE: {
    LIST: string;
  };
};

export const urlConstants: Readonly<UrlConstantsType> = Object.freeze({
  HOME: "/",
  SURVEY_RESPONSE: {
    LIST: "/survey/response/list",
  },
});
