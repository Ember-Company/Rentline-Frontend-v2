import * as React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { auth, Role } from '../lib/auth'
import {
  IconLayoutGrid,
  IconBuildingSkyscraper,
  IconHome2,
  IconFileDescription,
  IconTools,
  IconUsers,
  IconMailPlus,
  IconSettings,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'

/** tiny class combiner */
function cn(...a: Array<string | false | undefined>) {
  return a.filter(Boolean).join(' ')
}

type NavLink = {
  to: string
  labelKey: string  // i18n key (e.g. 'nav.properties')
  icon: React.ReactNode
  roles: Role[] | 'any'
}

const OWNER_ROLES: Role[] = ['Landlord', 'AgencyAdmin', 'Manager']
const TENANT_ROLES: Role[] = ['Tenant']

const LINKS: NavLink[] = [
  { to: '/',               labelKey: 'nav.dashboard',   icon: <IconLayoutGrid className="h-5 w-5" />, roles: 'any' },
  { to: '/properties',     labelKey: 'nav.properties',  icon: <IconBuildingSkyscraper className="h-5 w-5" />, roles: OWNER_ROLES },
  { to: '/units',          labelKey: 'nav.units',       icon: <IconHome2 className="h-5 w-5" />, roles: OWNER_ROLES },
  { to: '/leases',         labelKey: 'nav.leases',      icon: <IconFileDescription className="h-5 w-5" />, roles: [...OWNER_ROLES, ...TENANT_ROLES] },
  { to: '/maintenance',    labelKey: 'nav.maintenance', icon: <IconTools className="h-5 w-5" />, roles: 'any' },
  { to: '/tenants',        labelKey: 'nav.tenants',     icon: <IconUsers className="h-5 w-5" />, roles: OWNER_ROLES },
  { to: '/invites',        labelKey: 'nav.invites',     icon: <IconMailPlus className="h-5 w-5" />, roles: OWNER_ROLES },
  { to: '/settings',       labelKey: 'nav.settings',    icon: <IconSettings className="h-5 w-5" />, roles: 'any' },
]

export default function Sidebar() {
  const { t } = useTranslation()
  const router = useRouterState()
  const role = auth.role() ?? 'Viewer'

  // collapse state saved between reloads
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    return localStorage.getItem('sidebar-collapsed') === '1'
  })
  React.useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  // filter by role
  const visibleLinks = React.useMemo(
    () =>
      LINKS.filter((l) => l.roles === 'any' || l.roles.includes(role)),
    [role]
  )

  return (
    <aside
      className={cn(
        'sticky top-0 z-20 h-[calc(100vh-64px)] md:h-[calc(100vh-64px)]', // assuming Topbar ~64px
        'border-r border-divider backdrop-blur',
        'bg-gradient-to-b from-content2/60 to-transparent',
        collapsed ? 'w-20' : 'w-64',
        'hidden md:flex flex-col'
      )}
      aria-label="Sidebar"
    >
      {/* Brand */}
      <div className="flex items-center gap-3 px-3 pt-3 pb-2">
        <div className="h-7 w-7 rounded-lg bg-foreground/90 dark:bg-foreground/90" />
        {!collapsed && (
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-wide">Rentline</div>
            <div className="text-xs text-foreground-500">{role}</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="mt-2 grid gap-1 px-2 overflow-y-auto">
        {visibleLinks.map((item) => {
          const active = router.location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'group relative flex items-center gap-3 rounded-large px-3 py-2',
                'transition-colors',
                active
                  ? 'bg-primary/10 text-primary-600 dark:text-primary-400'
                  : 'hover:bg-content2 text-foreground'
              )}
            >
              <div
                className={cn(
                  'grid place-items-center rounded-md',
                  'h-8 w-8 shrink-0',
                  active ? 'bg-primary/20' : 'bg-content1 group-hover:bg-content2'
                )}
              >
                {item.icon}
              </div>
              {!collapsed && (
                <span className="truncate text-sm font-medium">
                  {t(item.labelKey)}
                </span>
              )}

              {/* active indicator bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer: collapse toggle */}
      <div className="mt-auto p-2">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className={cn(
            'flex w-full items-center justify-center gap-2 rounded-large border border-divider',
            'bg-content1 hover:bg-content2 px-3 py-2 text-sm'
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <IconChevronRight className="h-5 w-5" />
          ) : (
            <>
              <IconChevronLeft className="h-5 w-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
