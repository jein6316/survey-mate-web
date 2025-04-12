import api from "@/app/api/auth/api";

export const getSurveyForm = async (surveyUrl: string) => {
    const response = await api.get(`/api/survey/response/${surveyUrl}`);
    return response.data;
};

export const saveSurveyResponse = async ({sqMstId,surveyResponse}: {sqMstId: string, surveyResponse: SurveyResponse[]}) => {
    const response = await api.post("/api/survey/response", {sqMstId, surveyResponse});
    return response.data;
};

export const getSurveyResponseList = async (currentPage: number) => {
    const response = await api.get(`/api/survey/response/list`, {
        params: { page: currentPage - 1 }
    });
    return response.data;
};
