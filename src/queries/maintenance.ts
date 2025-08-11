import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { MaintenanceRequest } from '../types'

// Fetch maintenance requests for the current organisation.
// Accepts optional filters for propertyId, unitId and status.  When provided,
// they will be passed to the backend as query parameters.  The query key
// includes the filters object so separate caches are maintained per filter.
export function useMaintenance(filters?: { propertyId?: string; unitId?: string; status?: string }) {
  return useQuery<MaintenanceRequest[]>({
    queryKey: ['maintenance', filters ?? {}],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (filters?.propertyId) params.propertyId = filters.propertyId
      if (filters?.unitId) params.unitId = filters.unitId
      if (filters?.status) params.status = filters.status
      const res = await api.get('/api/maintenance', { params })
      return res.data
    },
  })
}

// Create a maintenance request
export function useCreateMaintenance() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { unitId: string; title: string; description?: string }) => {
      const res = await api.post('/api/maintenance', data)
      return res.data
    },
    onSuccess: () => {
      // invalidate all maintenance queries regardless of filters
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'maintenance' })
    },
  })
}

// Update maintenance status
export function useUpdateMaintenanceStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await api.post(
        `/api/maintenance/${id}/status`,
        status,
        { headers: { 'Content-Type': 'application/json' } },
      )
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'maintenance' })
    },
  })
}