import api from "@/app/api/auth/api";

export const getSurveyForm = async (surveyUrl: string) => {
    const response = await api.get(`/api/survey/response/${surveyUrl}`);
    return response.data;
};
