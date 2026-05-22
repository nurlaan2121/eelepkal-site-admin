import { apiClient } from '../client';
import { SignInRequest, AuthResponse } from '../../types/auth';

export const authService = {
    signIn: async (data: SignInRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/admins/sign-in', data);
        return response.data;
    },
};
