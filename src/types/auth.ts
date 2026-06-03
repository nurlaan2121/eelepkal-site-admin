export type UserRole = 'SUPER_ADMIN' | 'ADMIN';

export interface SignInRequest {
    phoneNumber: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    role: UserRole;
    venueId?: number;
    userId: number;
    phoneNumber?: string;
    email?: string;
}

export interface ExceptionResponse {
    message: string;
    debugMessage: string;
}

export interface SimpleResponse {
    status: string;
    message: string;
}

export interface SendOtpSmsRequest {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

export interface VerifyOtpRequest {
    phoneNumber: string;
    otp: string;
    fullName?: string;
    password?: string;
}

export interface ForgotPasswordRequest {
    phoneNumber: string;
}

export interface ResetPasswordRequest {
    phoneNumber: string;
    otpCode: string;
    newPassword: string;
}
