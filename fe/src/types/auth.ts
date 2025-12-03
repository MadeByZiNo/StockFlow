export interface AuthRequest {
    loginId: string;
    password: string;
}

export interface RegisterRequest {
    username: string; 
    password: string; 
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: any; 
}