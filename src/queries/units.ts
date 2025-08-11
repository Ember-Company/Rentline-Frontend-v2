import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { Unit } from '../types'

// Fetch units for a given property. When propertyId is undefined, this hook returns an empty array.
// Fetch units for a given property.  When propertyId is undefined or empty, returns an empty list.
export function useUnits(propertyId?: string) {
  return useQuery<Unit[]>({
    queryKey: ['units', propertyId],
    queryFn: async () => {
      if (!propertyId) return []
      const res = await api.get(`/api/units/by-property/${propertyId}`)
      return res.data
    },
    enabled: !!propertyId,
  })
}

export function useCreateUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      propertyId: string
      unitNumber: string
      bedrooms?: number
      bathrooms?: number
      areaSqm?: number
      rentAmount?: number
      currency?: string
    }) => {
      const res = await api.post('/api/units', data)
      return res.data
    },
    onSuccess: (_data, variables) => {
      // Invalidate units for the specific property
      queryClient.invalidateQueries({ queryKey: ['units', (variables as any).propertyId] })
    },
  })
}

export function useUpdateUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: {
        propertyId?: string
        unitNumber?: string
        bedrooms?: number
        bathrooms?: number
        areaSqm?: number
        rentAmount?: number
        currency?: string
      }
    }) => {
      const res = await api.put(`/api/units/${id}`, data)
      return res.data
    },
    onSuccess: (_data, variables) => {
      const varObj = variables as any
      if (varObj.data && varObj.data.propertyId) {
        queryClient.invalidateQueries({ queryKey: ['units', varObj.data.propertyId] })
      } else {
        // fallback to invalidating all queries starting with 'units'
        queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'units' })
      }
    },
  })
}

export function useDeleteUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    // Accept an object containing the unit id and the associated propertyId so
    // we can invalidate the correct query after deletion.  The propertyId is
    // optional because the caller might not know it; in that case we fall
    // back to invalidating all unit queries.
    mutationFn: async ({ id, propertyId }: { id: string; propertyId?: string }) => {
      const res = await api.delete(`/api/units/${id}`)
      return res.data
    },
    onSuccess: (_data, variables) => {
      const varObj = variables as { id: string; propertyId?: string }
      if (varObj.propertyId) {
        queryClient.invalidateQueries({ queryKey: ['units', varObj.propertyId] })
      } else {
        // If propertyId was not provided, invalidate all units queries
        queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'units' })
      }
    },
  })
}