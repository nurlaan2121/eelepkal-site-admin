export type UserRole = 'SUPER_ADMIN' | 'ADMIN';

export interface SignInRequest {
    email: string;
    password?: string;
}

export interface AuthResponse {
    accessToken: string;
    role: UserRole;
    venueId?: number;
    userId: number;
    email: string;
}

export interface ExceptionResponse {
    message: string;
    debugMessage: string;
}

export interface SuperAdminRegistrationRequest {
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
}

export interface VerifyEmailRequest {
    email: string;
    otp: string;
}
