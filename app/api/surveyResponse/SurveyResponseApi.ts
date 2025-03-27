import api from "@/app/api/auth/api";

export const getSurveyForm = async (surveyUrl: string) => {
    const response = await api.get(`/api/survey/response/${surveyUrl}`);
    return response.data;
};

export const saveSurveyResponse = async ({sqMstId,surveyResponse}: {sqMstId: string, surveyResponse: SurveyResponse[]}) => {
    const response = await api.post("/api/survey/response/save", {sqMstId, surveyResponse});
    return response.data;
};
