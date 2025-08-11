import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import type { Invite } from '../types'

// Fetch invites for the organisation.  Supports optional filters for searching
// by email and filtering by role.  The query key includes the filters object
// to allow separate caches.  Only non-empty filters are sent as query params.
export function useInvites(filters?: { search?: string; role?: string }) {
  return useQuery<Invite[]>({
    queryKey: ['invites', filters ?? {}],
    queryFn: async () => {
      const params: Record<string, any> = {}
      if (filters?.search) params.search = filters.search
      if (filters?.role) params.role = filters.role
      const res = await api.get('/api/invites', { params })
      return res.data
    },
  })
}

// Create a new invite
export function useCreateInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { email: string; role: string }) => {
      const res = await api.post('/api/invites', data)
      return res.data
    },
    onSuccess: () => {
      // invalidate all invites queries regardless of filters
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'invites' })
    },
  })
}

// Delete an invite
export function useDeleteInvite() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/invites/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (query) => query.queryKey[0] === 'invites' })
    },
  })
}