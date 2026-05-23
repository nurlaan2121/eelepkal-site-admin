import { apiClient } from '../client';

export interface AdminPersonal {
    id: number;
    fullName: string;
    phoneNumber: string;
    workAddress: string;
    email: string;
    password: string;
}

export interface AddPersonalRequest {
    fullName: string;
    phoneNumber: string;
    email: string;
    password: string;
}

export interface VerifyPersonalEmailRequest {
    email: string;
    otp: string;
}

export const superAdminService = {
    getAdmins: async (): Promise<AdminPersonal[]> => {
        const response = await apiClient.get<AdminPersonal[]>('/api/super-admin/myPersonal');
        return response.data;
    },

    deleteAdmin: async (adminId: number): Promise<void> => {
        await apiClient.delete(`/api/super-admin/delete-personal/${adminId}`);
    },

    addPersonal: async (data: AddPersonalRequest): Promise<{ httpStatus: string; message: string }> => {
        const response = await apiClient.post('/api/super-admin/add-personal-email', data);
        return response.data;
    },

    verifyPersonalEmail: async (data: VerifyPersonalEmailRequest): Promise<void> => {
        await apiClient.post('/api/super-admin/add-personal-verify-email', data);
    },
};
