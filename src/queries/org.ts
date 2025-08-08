import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import type { Organization } from '../types'
export const orgKeys = { me: ['org','me'] as const }
export function useOrgMe(){
  return useQuery({
    queryKey: orgKeys.me,
    queryFn: async () => {
      const { data } = await api.get<Organization>('/api/org/me')
      return data
    }
  })
}
