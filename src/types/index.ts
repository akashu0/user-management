export interface User {
    user_picture: null;
    responsibilities: never[];
    id: string;
    name: string;
    email: string;
    initials: string;
    phoneNumber: string;
    role: string;
    status: boolean;
    title: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
