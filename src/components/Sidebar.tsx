import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
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
  IconChartPie,
  IconCalendarEvent,
  IconReportAnalytics,
  IconSearch,
  IconUserCircle,
} from '@tabler/icons-react';
import { Input } from '@heroui/react';

// Helper to join class names conditionally without introducing truthy/falsey values.
function cn(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_SECTIONS: Array<{ title?: string; items: NavItem[] }> = [
  {
    title: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', icon: <IconLayoutGrid className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Portfolio',
    items: [
      { to: '/properties', label: 'Properties', icon: <IconBuildingSkyscraper className="w-5 h-5" /> },
      { to: '/units', label: 'Units', icon: <IconHome2 className="w-5 h-5" /> },
    ],
  },
  {
    // title: 'Leasing',
    items: [
      { to: '/leases', label: 'Leases', icon: <IconFileDescription className="w-5 h-5" /> },
    ],
  },
  {
    // title: 'People',
    items: [
      { to: '/tenants', label: 'Tenants', icon: <IconUsers className="w-5 h-5" /> },
      { to: '/invites', label: 'Invites', icon: <IconMailPlus className="w-5 h-5" /> },
    ],
  },
  {
    // title: 'Finances',
    items: [
      { to: '/reports', label: 'Reports', icon: <IconChartPie className="w-5 h-5" /> },
    ],
  },
  {
    // title: 'Maintenance',
    items: [
      { to: '/maintenance', label: 'Maintenance', icon: <IconTools className="w-5 h-5" /> },
    ],
  },
  {
    // title: 'Calendar',
    items: [
      { to: '/calendar', label: 'Calendar', icon: <IconCalendarEvent className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Documents',
    items: [
      { to: '/documents', label: 'Documents', icon: <IconFileDescription className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Reports',
    items: [
      { to: '/reports', label: 'Reports', icon: <IconReportAnalytics className="w-5 h-5" /> },
    ],
  },
];

/**
 * A collapsible navigation sidebar that organises primary application
 * destinations into logical sections. It includes a quick‑access search
 * control at the top and a user section at the bottom. The collapse
 * state is persisted in local storage to ensure a consistent experience
 * across reloads. Routing awareness is achieved via `useRouterState`.
 */
export default function Sidebar(): JSX.Element {
  const router = useRouterState();
  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    return localStorage.getItem('sidebar-collapsed') === '1';
  });
  React.useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  return (
    <aside
      className={cn(
        'sticky top-0 z-20 h-full bg-content1 border-r border-divider shadow-md',
        collapsed ? 'w-20' : 'w-64',
      )}
      aria-label="Sidebar"
    >
      {/* Brand and search */}
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <IconHome2 className="w-6 h-6" />
          {!collapsed && <span className="font-semibold text-lg">Rentline</span>}
        </div>
        <Input
        variant='faded'
            type="text"
            placeholder={collapsed ? '' : 'Search'}
            className={cn(
              collapsed && 'pl-2 text-center',
            )}
          />
      </div>
      {/* Navigation items */}
      <nav className="flex flex-col gap-1 overflow-y-auto px-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="flex flex-col gap-0">
            {/* {!collapsed && (
              <div className="text-xs font-medium uppercase tracking-wide text-foreground-500 px-2">
                {section.title}
              </div>
            )} */}
            {section.items.map((item) => {
              const active = router.location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-2 py-2 text-sm hover:bg-content2 transition-colors',
                    active && 'bg-primary/10 text-primary',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.icon}
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      {/* Footer with collapse toggle and user */}
      <div className="mt-auto p-4 flex flex-col gap-3">
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-divider bg-content2 px-3 py-2 text-sm hover:bg-content3"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <IconChevronRight className="h-5 w-5" /> : <IconChevronLeft className="h-5 w-5" />}
          {!collapsed && <span>{collapsed ? 'Expand' : 'Collapse'}</span>}
        </button>
        <div className={cn('flex items-center gap-3 px-2', collapsed && 'justify-center')}>
          <IconUserCircle className="h-6 w-6" />
          {!collapsed && (
            <div className="text-sm">
              <div className="font-medium">Theresa Webb</div>
              <div className="text-foreground-500 text-xs">mike@gmc.com</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
