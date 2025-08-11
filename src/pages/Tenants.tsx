import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import { Input, Skeleton } from '@heroui/react'
import DataTable from '../components/DataTable'
import { useTenants } from '../queries/tenants'
import type { Tenant } from '../types'

/**
 * Tenants page lists all users in the current organisation who have the Tenant
 * role.  This view is read–only: there is no ability to create or remove
 * tenants from the client; such actions occur via invites or the backend.
 */
export default function TenantsPage() {
  const { t } = useTranslation()
  const { data: tenants = [], isLoading } = useTenants()
  // local search state for filtering tenants by name or email
  const [search, setSearch] = useState('')

  const columns = useMemo<ColumnDef<Tenant>[]>(
    () => [
      {
        header: t('tenants.displayName') || 'Name',
        accessorKey: 'displayName',
        cell: info => info.getValue() || info.row.original.email,
      },
      {
        header: t('tenants.email') || 'Email',
        accessorKey: 'email',
      },
      {
        header: t('tenants.role') || 'Role',
        accessorKey: 'role',
      },
    ],
    [t],
  )

  // Filter tenants locally based on search term
  const filteredTenants = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return tenants
    return tenants.filter(tenant => {
      const name = tenant.displayName?.toLowerCase() ?? ''
      const email = tenant.email.toLowerCase()
      return name.includes(term) || email.includes(term)
    })
  }, [tenants, search])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">{t('tenants.title') || 'Tenants'}</h1>
      {/* Search input */}
      <div className="max-w-sm">
        <Input
          label={t('tenants.search') || 'Search'}
          placeholder={t('tenants.searchPlaceholder') || 'Search tenants'}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <Skeleton isLoaded={!isLoading} className="min-h-[200px]">
        <DataTable columns={columns} data={filteredTenants} />
      </Skeleton>
    </div>
  )
}