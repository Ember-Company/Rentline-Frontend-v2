import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { Property } from '../types'

// Fetch all properties for the organisation
/**
 * Fetch properties for the current organisation.
 *
 * Accepts an optional filter object.  When provided, filters will be passed as
 * query parameters to the backend (if supported).  The `search` field will
 * perform a free‐text search across the property name, street and city.  The
 * `ownerUserId` field limits results to a specific landlord when the
 * organisation is an agency.
 */
export function useProperties(filters?: { search?: string; ownerUserId?: string | null }) {
  return useQuery<Property[]>({
    queryKey: ['properties', filters ?? {}],
    queryFn: async () => {
      // Build query params only for defined filter values
      const params: Record<string, any> = {}
      if (filters?.search) {
        params.search = filters.search
      }
      if (filters?.ownerUserId) {
        params.ownerUserId = filters.ownerUserId
      }
      const res = await api.get('/api/properties', { params })
      return res.data
    },
  })
}

// Create a new property
export function useCreateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: {
      name: string
      street?: string
      city?: string
      state?: string
      postalCode?: string
      country?: string
      ownerUserId?: string | null
    }) => {
      const res = await api.post('/api/properties', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}

// Update an existing property
export function useUpdateProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: {
        name?: string
        street?: string
        city?: string
        state?: string
        postalCode?: string
        country?: string
        ownerUserId?: string | null
      }
    }) => {
      const res = await api.put(`/api/properties/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}

// Delete a property
export function useDeleteProperty() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/properties/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
  })
}