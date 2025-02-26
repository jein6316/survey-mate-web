import api from "@/app/api/auth/api";


export const getGroupInfoAPI = async () => {
    const response = await api.get("/api/group/getGroupInfo");
    return response.data;
};
