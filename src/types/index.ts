
interface Role {
    id: string;
    title: string;
}




export interface User {
    id: string;
    name: string;
    email: string;
    initials: string;
    phoneNumber: string;
    role: Role | null;
    status: boolean;
    title: string;
    phone: string;
    last_name: string;
    first_name: string;
    profile_image_url?: null;
    user_picture: null;
    responsibilities: never[];
}
export interface UserList {
    id: string;
    name: string;
    email: string;
    initials: string;
    phoneNumber: string;
    role: string;
    status: boolean;
    title: string;

}


export const initialFormState = {
    name: '',
    email: '',
    role: '',
    title: '',
    phone: '',
    initials: '',
    responsibilities: [] as string[],
    user_picture: null as File | string | null,
};

export interface AuthResponse {
    token: string;
    user: User;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
