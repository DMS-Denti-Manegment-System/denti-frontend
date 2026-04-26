// src/modules/dashboard/hooks/useDashboard.ts

import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../services/dashboardApi'

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
    select: (response: any) => response.data
  })
}
