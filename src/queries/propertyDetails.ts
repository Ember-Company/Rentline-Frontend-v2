import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'

/**
 * Fetch detailed information for a single property.  The backend should
 * expose an endpoint such as `GET /api/properties/{id}` that returns
 * rich property details including units, tenants, images, and other
 * metadata.  Until that endpoint is implemented, this query will
 * still return undefined data when the ID is falsey.  The query is
 * disabled if no ID is provided.
 *
 * @param id The property ID to load details for
 */
export function usePropertyDetails(id: string | undefined) {
  return useQuery({
    queryKey: ['propertyDetails', id],
    queryFn: async () => {
      if (!id) return null
      const res = await api.get(`/api/properties/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}