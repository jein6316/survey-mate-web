import api from "@/app/api/auth/api";

export const fetchGroupInfo = async (groupId: string) => {

    const response = await api.get(`/api/group/${groupId}`);
    return response.data;
};
