import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { Tenant } from '../types'

// Fetch all tenants in the organisation
export function useTenants() {
  return useQuery<Tenant[]>({
    queryKey: ['tenants'],
    queryFn: async () => {
      const res = await api.get('/api/tenants')
      return res.data
    },
  })
}