// src/api/usersService.ts
import apiClient from '@/services/apiClient';
import { User, PaginatedResponse } from '@/types/api';

interface GetUsersParams {
  pageNo: number;
  pageSize: number;
  username?: string;
  email?: string;
  phone?: string;
  [prop: string]: any;
}

const usersService = {
  // 获取用户列表
  getUsers(params: GetUsersParams) {
    return apiClient.get<PaginatedResponse<User>>('/users', { params });
  },
  // 添加用户
  addUser(user: Partial<User> & { password: string }) {
    return apiClient.post<User>('/users', user);
  },
  // 更新用户
  updateUser(id: number, user: Partial<User>) {
    return apiClient.put<User>(`/users/${id}`, user);
  },
  // 删除用户
  deleteUser(id: number) {
    return apiClient.delete(`/users/${id}`);
  },
}

export default usersService;
