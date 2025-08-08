import { Card, Button, Spinner } from '@heroui/react'
import { useOrgMe } from '../queries/org'
import { orgTypeLabel } from '../types'
import DataTable from '../components/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function Dashboard(){
  const { data: org, isLoading, isError, refetch } = useOrgMe()
  const { t } = useTranslation()

  const properties = org?.properties ?? []
  const columns = useMemo<ColumnDef<any>[]>(() => [
    { header: t('nav.properties'), accessorKey: 'name' },
    { header: 'City', accessorKey: 'city' },
    { header: t('dashboard.units'), cell: ({ row }) => row.original.units?.length ?? 0 },
    { header: t('dashboard.view'), cell: ({ row }) => <Button size="sm" variant="flat">Open</Button> }
  ], [t])

  if (isLoading) return <div className="p-6"><Spinner size="lg" /></div>
  if (isError) return <div className="p-6"><Card className="p-6"><div className="text-danger">Failed to load. <Button size="sm" onPress={() => refetch()}>Retry</Button></div></Card></div>

  return (
    <div className="p-6 grid gap-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-foreground-500">{t('dashboard.org')}</div>
          <div className="text-xl font-semibold">{org?.name}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-foreground-500">{t('dashboard.type')}</div>
          <div className="text-xl font-semibold">{orgTypeLabel(org?.type ?? 0)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-foreground-500">{t('dashboard.properties')}</div>
          <div className="text-xl font-semibold">{properties.length}</div>
        </Card>
      </div>

      <Card className="p-4 grid gap-4">
        <div className="text-lg font-semibold">{t('nav.properties')}</div>
        <DataTable columns={columns} data={properties} />
      </Card>
    </div>
  )
}
