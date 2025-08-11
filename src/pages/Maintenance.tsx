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
import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../components/DataTable'
import { auth } from '../lib/auth'
import { useMaintenance, useCreateMaintenance, useUpdateMaintenanceStatus } from '../queries/maintenance'
import { useProperties } from '../queries/properties'
import { useUnits } from '../queries/units'
import type { MaintenanceRequest, Property, Unit } from '../types'

/**
 * Maintenance page shows all maintenance requests for the current organisation.  Tenants
 * can create new requests, while landlords, agency admins, managers and maintenance
 * staff can update the status of existing requests.  Each request is linked to a
 * unit.  A simple form at the bottom allows tenants to report new issues.
 */
export default function MaintenancePage() {
  const { t } = useTranslation()
  const role = auth.role()
  // Filter state: property, unit, status, search by title
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string | undefined>(undefined)
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string | ''>('')
  const [search, setSearch] = useState('')
  const { data: properties = [] } = useProperties()
  const { data: units = [] } = useUnits(selectedPropertyFilter)
  // Fetch all maintenance requests once; filter client‑side below.  You can
  // enable server‑side filtering later by passing a filter object to
  // useMaintenance().
  const { data: maintenance = [], isLoading } = useMaintenance()
  const createMaintenance = useCreateMaintenance()
  const updateStatus = useUpdateMaintenanceStatus()
  // Form state for tenant reporting
  const [form, setForm] = useState({ unitId: '', title: '', description: '' })
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const canEditStatus = ['Landlord', 'AgencyAdmin', 'Manager', 'Maintenance'].includes(role ?? '')

  const handleStatusChange = async (req: MaintenanceRequest, status: string) => {
    if (!status || status === req.status) return
    try {
      await updateStatus.mutateAsync({ id: req.id, status })
    } catch (err) {
      console.error(err)
    }
  }

  const statusOptions = ['Pending', 'InProgress', 'Resolved']

  const columns = useMemo<ColumnDef<MaintenanceRequest>[]>(
    () => [
      {
        header: t('maintenance.title') || 'Title',
        accessorKey: 'title',
      },
      {
        header: t('maintenance.unit') || 'Unit',
        accessorKey: 'unitId',
      },
      {
        header: t('maintenance.status') || 'Status',
        accessorKey: 'status',
        cell: info => {
          const req = info.row.original
          const value = info.getValue() as string
          if (canEditStatus) {
            return (
              <Select
                selectedKeys={value ? [value] : []}
                onChange={e => handleStatusChange(req, e.target.value)}
              >
                {statusOptions.map(s => (
                  <SelectItem key={s}>{s}</SelectItem>
                ))}
              </Select>
            )
          }
          return value
        },
      },
    ],
    [t, canEditStatus],
  )

  // Client‑side filtering: search by title, filter by property, unit and status
  const filteredMaintenance = useMemo(() => {
    let list = maintenance as MaintenanceRequest[]
    // Filter by selected property: include only requests whose unit belongs
    // to the selected property.  We rely on the units list fetched above.
    if (selectedPropertyFilter) {
      const unitIdsForProp = new Set(units.map(u => u.id))
      list = list.filter(req => unitIdsForProp.has(req.unitId))
    }
    // Filter by specific unit
    if (selectedUnitFilter) {
      list = list.filter(req => req.unitId === selectedUnitFilter)
    }
    // Filter by status
    if (statusFilter) {
      list = list.filter(req => req.status === statusFilter)
    }
    // Filter by search title (case-insensitive)
    const term = search.trim().toLowerCase()
    if (term) {
      list = list.filter(req => req.title.toLowerCase().includes(term))
    }
    return list
  }, [maintenance, selectedPropertyFilter, selectedUnitFilter, statusFilter, search, units])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.unitId || !form.title) return
    try {
      await createMaintenance.mutateAsync({ unitId: form.unitId, title: form.title, description: form.description || undefined })
      // reset form and close drawer
      setForm({ unitId: '', title: '', description: '' })
      setSelectedPropertyFilter(undefined)
      setIsDrawerOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-2xl font-semibold">{t('maintenance.title') || 'Maintenance'}</h1>
        <div className="flex flex-wrap gap-2 items-end">
          {/* Filters: property, unit, status, search */}
          <div className="w-40">
            <Select
              label={t('maintenance.selectProperty') || 'Property'}
              selectedKeys={selectedPropertyFilter ? [selectedPropertyFilter] : []}
              onChange={e => {
                const id = e.target.value
                setSelectedPropertyFilter(id)
                setSelectedUnitFilter(undefined)
              }}
            >
              {properties.map((p: Property) => (
                <SelectItem key={p.id}>{p.name}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-40">
            <Select
              label={t('maintenance.selectUnit') || 'Unit'}
              selectedKeys={selectedUnitFilter ? [selectedUnitFilter] : []}
              onChange={e => setSelectedUnitFilter(e.target.value)}
              isDisabled={!selectedPropertyFilter}
            >
              {units.map((u: Unit) => (
                <SelectItem key={u.id}>{u.unitNumber}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="w-36">
            <Select
              label={t('maintenance.statusFilter') || 'Status'}
              selectedKeys={statusFilter ? [statusFilter] : []}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <SelectItem key="">{t('maintenance.allStatuses') || 'All'}</SelectItem>
              {statusOptions.map(s => (
                <SelectItem key={s}>{s}</SelectItem>
              ))}
            </Select>
          </div>
          <Input
            placeholder={t('maintenance.search') || 'Search by title…'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-48"
          />
          {/* New maintenance report button for tenants */}
          {role === 'Tenant' && (
            <Button color="primary" onClick={() => setIsDrawerOpen(true)}>
              {t('maintenance.report') || 'Report Issue'}
            </Button>
          )}
        </div>
      </div>
      <Skeleton isLoaded={!isLoading} className="rounded-large">
        <DataTable columns={columns} data={filteredMaintenance} />
      </Skeleton>
      {/* Drawer for tenant issue reporting */}
      {role === 'Tenant' && (
        <Drawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} placement="right" size="lg">
          <DrawerContent className="max-w-md">
            <DrawerHeader>
              <h2 className="text-lg font-semibold">{t('maintenance.report') || 'Report Issue'}</h2>
            </DrawerHeader>
            <DrawerBody>
              <form id="maintenance-form" className="grid gap-3" onSubmit={handleSubmit}>
                <Select
                  label={t('maintenance.selectProperty') || 'Property'}
                  selectedKeys={selectedPropertyFilter ? [selectedPropertyFilter] : []}
                  onChange={e => {
                    const id = e.target.value
                    setSelectedPropertyFilter(id)
                    setForm(f => ({ ...f, unitId: '' }))
                  }}
                >
                  {properties.map((p: Property) => (
                    <SelectItem key={p.id}>{p.name}</SelectItem>
                  ))}
                </Select>
                <Select
                  label={t('maintenance.selectUnit') || 'Unit'}
                  selectedKeys={form.unitId ? [form.unitId] : []}
                  onChange={e => setForm({ ...form, unitId: e.target.value })}
                  isDisabled={!selectedPropertyFilter}
                >
                  {units.map((u: Unit) => (
                    <SelectItem key={u.id}>{u.unitNumber}</SelectItem>
                  ))}
                </Select>
                <Input
                  label={t('maintenance.title') || 'Title'}
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                />
                <Input
                  label={t('maintenance.description') || 'Description'}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </form>
            </DrawerBody>
            <DrawerFooter className="flex gap-2">
              <Button
                type="submit"
                form="maintenance-form"
                color="primary"
                isLoading={createMaintenance.isPending}
              >
                {t('create') || 'Create'}
              </Button>
              <Button type="button" variant="light" onClick={() => setIsDrawerOpen(false)}>
                {t('cancel') || 'Cancel'}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  )
}