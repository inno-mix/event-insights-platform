// ─── Auth Types ───
export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    organizationName: string;
}

export interface AuthResponse {
    accessToken: string;
    user: UserProfile;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    orgId: string;
}

export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface JwtPayload {
    sub: string;
    email: string;
    orgId: string;
    role: UserRole;
}
