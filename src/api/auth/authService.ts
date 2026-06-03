import { apiClient } from '../client';
import {
    SignInRequest,
    AuthResponse,
    VerifyOtpRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    SimpleResponse,
    SendOtpSmsRequest,
} from '../../types/auth';

export const authService = {
    signIn: async (data: SignInRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/sign-in', data);
        return response.data;
    },

    /** Step 1: send OTP SMS to super-admin phone */
    sendOtpSms: async (data: SendOtpSmsRequest): Promise<SimpleResponse> => {
        const response = await apiClient.post<SimpleResponse>('/api/auth/super-admin/send-otp-sms', data);
        return response.data;
    },

    /** Step 2: verify OTP and create super-admin account */
    verifyOtp: async (data: VerifyOtpRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/super-admin/verify', data);
        return response.data;
    },

    /** Forgot-password step 1: request OTP SMS */
    forgotPassword: async (data: ForgotPasswordRequest): Promise<SimpleResponse> => {
        const response = await apiClient.post<SimpleResponse>('/api/auth/forgot-password', data);
        return response.data;
    },

    /** Forgot-password step 2: reset password with OTP */
    resetPassword: async (data: ResetPasswordRequest): Promise<SimpleResponse> => {
        const response = await apiClient.post<SimpleResponse>('/api/auth/reset-password', data);
        return response.data;
    },
};

