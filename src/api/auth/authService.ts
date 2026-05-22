import { apiClient } from '../client';
import { SignInRequest, AuthResponse, SuperAdminRegistrationRequest, VerifyEmailRequest } from '../../types/auth';

export const authService = {
    signIn: async (data: SignInRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/admins/sign-in', data);
        return response.data;
    },
    signUpSuperAdmin: async (data: SuperAdminRegistrationRequest): Promise<void> => {
        await apiClient.post('/api/auth/super-admin/send-otp-email', data);
    },
    verifyEmail: async (data: VerifyEmailRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/super-admin/verify-email', data);
        return response.data;
    },
};
