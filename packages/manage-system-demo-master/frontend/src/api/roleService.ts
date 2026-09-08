// src/api/rolesService.ts
import apiClient from '@/services/apiClient';
import { Role } from '@/types/api';

interface GetRolesParams {
  name?: string;
}

const rolesService = {
  getRoles(params: GetRolesParams) {
    return apiClient.get<Role[]>('/roles', { params });
  },
  addRole(role: Partial<Role>) {
    return apiClient.post<Role>('/roles', role);
  },
  updateRole(id: number, role: Partial<Role>) {
    return apiClient.put<Role>(`/roles/${id}`, role);
  },
  deleteRole(id: number) {
    return apiClient.delete(`/roles/${id}`);
  },
};

export default rolesService;