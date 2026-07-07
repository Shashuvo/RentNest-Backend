export interface RegisterUserPayload {
    name: string,
    email: string,
    password: string,
    role?: string,
    status?: string,
    phone?: string,
    address?: string,
    photoUrl?: string
}

export interface LoginPayload {
    email: string,
    password: string
}