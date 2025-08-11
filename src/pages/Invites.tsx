import { useState, useMemo } from 'react'
import {
  Button,
  Card,
  Input,
  Select,
  SelectItem,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Skeleton,
} from '@heroui/react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@tanstack/react-table'
import DataTable from '../components/DataTable'
import { useInvites, useCreateInvite, useDeleteInvite } from '../queries/invites'
import type { Invite } from '../types'

/**
 * Invites page allows an organisation admin or manager to see all pending
 * invitations, create new invites and revoke existing ones.  Only a
 * limited set of roles can be assigned via invite (Tenant, Maintenance,
 * Viewer).  The expiration and status fields are displayed if present.
 */
export default function InvitesPage() {
  const { t } = useTranslation()
  // filter states
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | undefined>()
  // drawer state
  const [isDrawerOpen, setDrawerOpen] = useState(false)
  const [form, setForm] = useState({ email: '', role: 'Tenant' })
  const roleOptions = ['Tenant', 'Maintenance', 'Viewer']

  // Fetch all invites; filtering is done client‑side below.  Pass a filter
  // object to useInvites() later if server‑side filtering becomes available.
  const { data: invites = [], isLoading } = useInvites()
  const createInvite = useCreateInvite()
  const deleteInvite = useDeleteInvite()

  // handle create invite submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email) return
    try {
      await createInvite.mutateAsync({ email: form.email, role: form.role })
      setForm({ email: '', role: 'Tenant' })
      setDrawerOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t('invites.confirmDelete') || 'Are you sure?')) return
    await deleteInvite.mutateAsync(id)
  }

  // Compute filtered invites based on search and roleFilter
  const filteredInvites = useMemo(() => {
    let list = invites
    // filter by role
    if (roleFilter) {
      list = list.filter(inv => inv.role === roleFilter)
    }
    // filter by search (email contains)
    const term = search.trim().toLowerCase()
    if (term) {
      list = list.filter(inv => inv.email.toLowerCase().includes(term))
    }
    return list
  }, [invites, roleFilter, search])

  // table columns
  const columns = useMemo<ColumnDef<Invite>[]>(
    () => [
      {
        header: t('invites.email') || 'Email',
        accessorKey: 'email',
      },
      {
        header: t('invites.role') || 'Role',
        accessorKey: 'role',
        // Display translated role name using the roles dictionary.  Fallback to
        // the raw role string if no translation is available.
        cell: info => {
          const value = info.getValue() as string
          return t(`roles.${value}`) || value
        },
      },
      {
        header: t('invites.status') || 'Status',
        accessorKey: 'status',
        // Display translated status using the statuses dictionary.  Fallback to
        // the raw status string if no translation exists.
        cell: info => {
          const value = info.getValue() as string
          return t(`statuses.${value}`) || value
        },
      },
      {
        header: t('invites.expiresAt') || 'Expires',
        accessorKey: 'expiresAt',
        cell: info => {
          const value = info.getValue() as string | undefined
          return value ? new Date(value).toLocaleDateString() : '-'
        },
      },
      {
        id: 'actions',
        header: t('actions') || 'Actions',
        cell: ({ row }) => (
          <Button size="sm" color="danger" onClick={() => handleDelete(row.original.id)}>
            {t('delete') || 'Delete'}
          </Button>
        ),
      },
    ],
    [t],
  )

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h1 className="text-2xl font-semibold">{t('invites.title') || 'Invites'}</h1>
        {/* Filters and new invite button */}
        <div className="flex flex-col md:flex-row gap-2 md:items-end">
          <Input
            label={t('invites.search') || 'Search'}
            placeholder={t('invites.searchPlaceholder') || 'Search email'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Select
            label={t('invites.filterRole') || 'Role'}
            selectedKeys={roleFilter ? [roleFilter] : []}
            onChange={e => setRoleFilter(e.target.value || undefined)}
          >
            <SelectItem key="">{t('all') || 'All'}</SelectItem>
            {roleOptions.map(r => (
              <SelectItem key={r}>{r}</SelectItem>
            ))}
          </Select>
          <Button onClick={() => setDrawerOpen(true)} color="primary">
            {t('invites.create') || 'Create Invite'}
          </Button>
        </div>
      </div>
      {/* Data table */}
      <Skeleton isLoaded={!isLoading} className="min-h-[200px]">
        <DataTable columns={columns} data={filteredInvites} />
      </Skeleton>
      {/* Drawer for creating invite */}
      <Drawer isOpen={isDrawerOpen} onOpenChange={setDrawerOpen} placement="right" size="lg">
        <DrawerContent>
          <DrawerHeader>{t('invites.create') || 'Create Invite'}</DrawerHeader>
          <DrawerBody>
            <form id="invite-form" className="grid gap-4" onSubmit={handleSubmit}>
              <Input
                label={t('invites.email') || 'Email'}
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                type="email"
                required
              />
              <Select
                label={t('invites.role') || 'Role'}
                selectedKeys={form.role ? [form.role] : []}
                onChange={e => setForm({ ...form, role: e.target.value })}
                required
              >
                {roleOptions.map(r => (
                  <SelectItem key={r}>{r}</SelectItem>
                ))}
              </Select>
            </form>
          </DrawerBody>
          <DrawerFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>
              {t('cancel') || 'Cancel'}
            </Button>
            <Button
              form="invite-form"
              type="submit"
              color="primary"
              isLoading={createInvite.isPending}
            >
              {t('create') || 'Create'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}