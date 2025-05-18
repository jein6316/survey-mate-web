import api from "@/app/web-api/auth/api";
import {GroupData} from "@/app/types/apiTypes";

export const getGroupInfo = async (groupId: string) => {
    const response = await api.get(`/api/group/${groupId}`);
    return response.data;
};


export const saveOrupdateGroupData = async (formData: GroupData) => {
    const response = await api.put("/api/group", formData);
    return response.data.data;
};

export const getGroupMembers = async (groupId: string, currentPage: number) => {
    const response = await api.get(`/api/group/${groupId}/members`, {
        params: {page: currentPage - 1, size: 10}
    });
    return response.data;
};
