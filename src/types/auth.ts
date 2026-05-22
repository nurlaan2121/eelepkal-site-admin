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
