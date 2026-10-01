export interface ApiResponse<T> {
    message: string;
    data: T;
    httpStatus: number;
}

export interface PostAdmin {
    id: number;
    email: string;
    organization: string;
    role: string;
    userId: number | null;
    createdAt: string;
    updatedAt: string;
}

export interface AdminCredentials {
    email: string;
    password: string;
}

export interface RegistrationVerification {
    email: string;
    token: string;
}
