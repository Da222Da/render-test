// src/api/authService.ts
import apiClient from '@/services/apiClient';
import { LoginResponse, RegisterResponse, RefreshTokenResponse, User } from '@/types/api';

const authService = {
  login(params: { username: string; password: string }) {
    return apiClient.post<LoginResponse>('/login', params);
  },
  register(params: { username: string; password: string; email: string }) {
    return apiClient.post<RegisterResponse>('/register', params);
  },
  refreshToken(refreshToken: string) {
    return apiClient.post<RefreshTokenResponse>('/refreshToken', { refreshToken });
  },
  logout() {
    return apiClient.post<void>('/logout');
  },
  getUser() {
    return apiClient.get<User>('/getUserInfo');
  },
};

export default authService;
