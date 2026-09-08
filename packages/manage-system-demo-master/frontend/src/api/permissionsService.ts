// src/api/permissionsService.ts
import apiClient from '@/services/apiClient';
import { Permission, PaginatedResponse } from '@/types/api';

interface GetPermissionsParams {
  pageNo: number;
  pageSize: number;
  name?: string;
}

const permissionsService = {
  getPermissions(params: GetPermissionsParams) {
    return apiClient.get<PaginatedResponse<Permission>>('/permissions', { params });
  },
  addPermission(permission: Partial<Permission>) {
    return apiClient.post<Permission>('/permissions', permission);
  },
  updatePermission(id: number, permission: Partial<Permission>) {
    return apiClient.put<Permission>(`/permissions/${id}`, permission);
  },
  deletePermission(id: number) {
    return apiClient.delete(`/permissions/${id}`);
  }
};

export default permissionsService