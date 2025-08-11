import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { Lease } from '../types'

// Fetch leases for a given unit. When unitId is undefined, returns an empty array.
export function useLeases(unitId?: string) {
  return useQuery<Lease[]>({
    queryKey: ['leases', unitId],
    queryFn: async () => {
      if (!unitId) return [] as Lease[]
      const res = await api.get(`/api/leases/by-unit/${unitId}`)
      return res.data
    },
    enabled: !!unitId,
  })
}

// Create a lease
export function useCreateLease() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      unitId: string
      tenantUserId: string
      startDate: string
      endDate: string
      monthlyRent: number
    }) => {
      const res = await api.post('/api/leases', data)
      return res.data
    },
    onSuccess: (_data, variables) => {
      // Invalidate leases list for the given unit
      const varObj = variables as any
      queryClient.invalidateQueries({ queryKey: ['leases', varObj.unitId] })
    },
  })
}

// Update a lease
export function useUpdateLease() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: {
        unitId?: string
        tenantUserId?: string
        startDate?: string
        endDate?: string
        monthlyRent?: number
        status?: string
      }
    }) => {
      const res = await api.put(`/api/leases/${id}`, data)
      return res.data
    },
    onSuccess: (_data, variables) => {
      // Invalidate leases list; if unitId changed, both old and new lists should be invalidated. For simplicity, invalidate all leases queries
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'leases' })
    },
  })
}

// Delete a lease
export function useDeleteLease() {
  const queryClient = useQueryClient()
  return useMutation({
    // Accept both the lease id and the associated unit id so we can
    // invalidate the correct leases query.  The unitId is optional; if
    // omitted we will fall back to invalidating all leases queries.
    mutationFn: async ({ id, unitId }: { id: string; unitId?: string }) => {
      const res = await api.delete(`/api/leases/${id}`)
      return res.data
    },
    onSuccess: (_data, variables) => {
      const varObj = variables as { id: string; unitId?: string }
      if (varObj.unitId) {
        queryClient.invalidateQueries({ queryKey: ['leases', varObj.unitId] })
      } else {
        queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'leases' })
      }
    },
  })
}