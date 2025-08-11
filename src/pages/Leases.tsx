import { useState, useMemo } from 'react'
import {
  Button,
  Input,
  Select,
  SelectItem,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Skeleton,
} from '@heroui/react'
import { useTranslation } from 'react-i18next'
import { ColumnDef } from '@tanstack/react-table'
import DataTable from '../components/DataTable'
import { useProperties } from '../queries/properties'
import { useUnits } from '../queries/units'
import { useLeases, useCreateLease, useUpdateLease, useDeleteLease } from '../queries/leases'
import { useTenants } from '../queries/tenants'
import type { Lease, Unit, Property, Tenant } from '../types'

export default function LeasesPage() {
  const { t } = useTranslation()
  // Filter state for search by tenant
  const [search, setSearch] = useState('')
  // Property and unit selection
  const { data: properties = [] } = useProperties()
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(undefined)
  const { data: units = [] } = useUnits(selectedPropertyId)
  const [selectedUnitId, setSelectedUnitId] = useState<string | undefined>(undefined)
  // Fetch leases for selected unit
  const { data: leases = [], isLoading } = useLeases(selectedUnitId)
  // Fetch tenants for tenant selection and display names in filters
  const { data: tenants = [] } = useTenants()
  const createLease = useCreateLease()
  const updateLease = useUpdateLease()
  const deleteLease = useDeleteLease()
  // Editing state and form state
  const [editing, setEditing] = useState<Lease | null>(null)
  const [form, setForm] = useState({
    unitId: '' as string,
    tenantUserId: '' as string,
    startDate: '',
    endDate: '',
    monthlyRent: '' as string,
  })
  // Drawer open state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const startCreate = () => {
    setEditing(null)
    setForm({ unitId: selectedUnitId || '', tenantUserId: '', startDate: '', endDate: '', monthlyRent: '' })
    setIsDrawerOpen(true)
  }
  const startEdit = (lease: Lease) => {
    setEditing(lease)
    setForm({
      unitId: lease.unitId,
      tenantUserId: lease.tenantUserId,
      startDate: lease.startDate.slice(0, 10),
      endDate: lease.endDate.slice(0, 10),
      monthlyRent: lease.monthlyRent.toString(),
    })
    setSelectedPropertyId(
      properties.find(p => p.units?.some(u => u.id === lease.unitId))?.id,
    )
    setSelectedUnitId(lease.unitId)
    setIsDrawerOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      unitId: form.unitId,
      tenantUserId: form.tenantUserId,
      startDate: form.startDate,
      endDate: form.endDate,
      monthlyRent: form.monthlyRent ? Number(form.monthlyRent) : 0,
    }
    try {
      if (editing) {
        await updateLease.mutateAsync({ id: editing.id, data: payload })
      } else {
        await createLease.mutateAsync(payload)
      }
      setEditing(null)
      setIsDrawerOpen(false)
      setForm({ unitId: selectedUnitId || '', tenantUserId: '', startDate: '', endDate: '', monthlyRent: '' })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (lease: Lease) => {
    if (!confirm(t('leases.confirmDelete') || 'Are you sure?')) return
    await deleteLease.mutateAsync({ id: lease.id, unitId: lease.unitId })
  }

  // Filter leases based on search; search matches tenant display name or email
  const filteredLeases = useMemo(() => {
    if (!search) return leases
    const lower = search.toLowerCase()
    return leases.filter(l => {
      const tenant = tenants.find(t => t.id === l.tenantUserId)
      const name = (tenant?.displayName || tenant?.email || '').toLowerCase()
      return name.includes(lower)
    })
  }, [leases, search, tenants])

  const columns = useMemo<ColumnDef<Lease>[]>(
    () => [
      {
        header: t('leases.startDate') || 'Start',
        accessorKey: 'startDate',
      },
      {
        header: t('leases.endDate') || 'End',
        accessorKey: 'endDate',
      },
      {
        header: t('leases.monthlyRent') || 'Rent',
        accessorKey: 'monthlyRent',
        cell: info => {
          const val = info.getValue() as number
          return val.toLocaleString(undefined, { style: 'currency', currency: 'BRL' })
        },
      },
      {
        header: t('leases.status') || 'Status',
        accessorKey: 'status',
      },
      {
        id: 'actions',
        header: t('actions') || 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => startEdit(row.original)}>{t('edit') || 'Edit'}</Button>
            <Button size="sm" color="danger" onClick={() => handleDelete(row.original)}>{t('delete') || 'Delete'}</Button>
          </div>
        ),
      },
    ],
    [t],
  )

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-semibold">{t('leases.title') || 'Leases'}</h1>
        <div className="flex gap-2 flex-wrap items-end">
          <Input
            placeholder={t('leases.searchTenant') || 'Search tenant…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-48"
          />
          <div className="w-44">
            <Select
              label={t('leases.selectProperty') || 'Property'}
              selectedKeys={selectedPropertyId ? [selectedPropertyId] : []}
              onChange={e => {
                const id = e.target.value
                setSelectedPropertyId(id)
                setSelectedUnitId(undefined)
                setForm(f => ({ ...f, unitId: '' }))
              }}
            >
              {properties.map((p: Property) => (
                <SelectItem key={p.id}>{p.name}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-44">
            <Select
              label={t('leases.selectUnit') || 'Unit'}
              selectedKeys={selectedUnitId ? [selectedUnitId] : []}
              onChange={e => {
                const id = e.target.value
                setSelectedUnitId(id)
                setForm(f => ({ ...f, unitId: id }))
              }}
              isDisabled={!selectedPropertyId}
            >
              {units.map((u: Unit) => (
                <SelectItem key={u.id}>{u.unitNumber}</SelectItem>
              ))}
            </Select>
          </div>
          <Button color="primary" onClick={startCreate} disabled={!selectedUnitId}>
            {t('leases.new') || 'New Lease'}
          </Button>
        </div>
      </div>
      {/* Data table with skeleton */}
      <Skeleton isLoaded={!isLoading} className="rounded-large">
        <DataTable columns={columns} data={filteredLeases} />
      </Skeleton>
      {/* Drawer for create/edit form */}
      <Drawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} placement="right" size="lg">
        <DrawerContent className="max-w-md">
          <DrawerHeader>
            <h2 className="text-lg font-semibold">
              {editing ? t('leases.edit') || 'Edit Lease' : t('leases.create') || 'Create Lease'}
            </h2>
          </DrawerHeader>
          <DrawerBody>
            <form id="lease-form" className="grid gap-3" onSubmit={handleSubmit}>
              <Select
                label={t('leases.tenant') || 'Tenant'}
                selectedKeys={form.tenantUserId ? [form.tenantUserId] : []}
                onChange={e => setForm({ ...form, tenantUserId: e.target.value })}
              >
                {tenants.map((tenant: Tenant) => (
                  <SelectItem key={tenant.id}>{tenant.displayName || tenant.email}</SelectItem>
                ))}
              </Select>
              <Input
                type="date"
                label={t('leases.startDate') || 'Start Date'}
                value={form.startDate}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
                required
              />
              <Input
                type="date"
                label={t('leases.endDate') || 'End Date'}
                value={form.endDate}
                onChange={e => setForm({ ...form, endDate: e.target.value })}
                required
              />
              <Input
                type="number"
                label={t('leases.monthlyRent') || 'Monthly Rent'}
                value={form.monthlyRent}
                onChange={e => setForm({ ...form, monthlyRent: e.target.value })}
                required
              />
            </form>
          </DrawerBody>
          <DrawerFooter className="flex gap-2">
            <Button
              type="submit"
              form="lease-form"
              color="primary"
              isLoading={createLease.isPending || updateLease.isPending}
            >
              {editing ? t('save') || 'Save' : t('create') || 'Create'}
            </Button>
            <Button type="button" variant="light" onClick={() => setIsDrawerOpen(false)}>
              {t('cancel') || 'Cancel'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}