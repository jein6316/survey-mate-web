import api from "@/app/web-api/auth/api";

export const getSurveyForm = async (surveyUrl: string, srMstId: string) => {
    if(srMstId){
        const response = await api.get(`/api/survey/response/listBySurvey/${srMstId}`);
        return response.data;
    }else if(surveyUrl){
        const response = await api.get(`/api/survey/response/${surveyUrl}`);
        return response.data;
    }

};

export const saveSurveyResponse = async ({sqMstId, surveyResponse}: {
    sqMstId: string,
    surveyResponse: SurveyResponse[]
}) => {
    const response = await api.post("/api/survey/response", {sqMstId, surveyResponse});
    return response.data;
};

export const getSurveyResponseList = async (currentPage: number, clientCurrentDate: string) => {
    const response = await api.get(`/api/survey/response/list`, {

        params: {page: currentPage - 1, clientDate: clientCurrentDate}
    });
    return response.data;
};
