import api from "./api";
import type { AuthRequest, AuthResponse } from "../types/auth";

const authService = {
  async login(userData: AuthRequest ) {
  const response = await api.post<AuthResponse>("/api/auth/login", userData);
  const { access_token, refresh_token, user } = response.data;

    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
  },

  async register(userData: AuthRequest) {
    const response = await api.post<AuthResponse>("/api/auth/register", userData);
    const { access_token, refresh_token, user } = response.data;

    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data;
  },

  async logout() {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      await api.post("/api/auth/logout", null, {
        headers: {
          'X-Refresh-Token': refreshToken 
        }
      });
      
    } catch (error) {

      console.error("서버 로그아웃 요청 실패, 클라이언트 상태 초기화:", error);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  },
};
export default authService;