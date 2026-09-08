import apiClient from '@/services/apiClient';
import { DashboardStats } from '@/types/api';

const statsService = {
  // 获取首页统计数据
  getDashboardStats() {
    return apiClient.get<DashboardStats>('/dashboard-stats');
  },
};

export default statsService;