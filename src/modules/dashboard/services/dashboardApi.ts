// src/modules/dashboard/services/dashboardApi.ts

import { api } from '../../../shared/services/api'
import { DashboardStats } from '../types/dashboard.types'

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats')
}
