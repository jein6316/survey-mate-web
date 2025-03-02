import api from "@/app/api/auth/api";
import {GroupData} from "@/app/types/apiTypes";

export const getGroupInfo = async (groupId: string) => {
    const response = await api.get(`/api/group/${groupId}`);
    return response.data;
};


export const saveOrupdateGroupData = async (formData: GroupData) => {
    const response = await api.put("/api/group", formData);
    return response.data.data;
};
