import React from 'react';
import { Outlet } from '@tanstack/react-router';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

/**
 * High‑level page layout used for all authenticated pages. It composes a
 * persistent sidebar and top bar and provides a flex container for
 * rendering the active route via the `Outlet`. The layout is fully
 * responsive: on smaller viewports the sidebar collapses to save space.
 */
export default function DashboardLayout() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] bg-background">
      <Topbar />
      <div className="grid grid-cols-1 md:grid-cols-[18rem_1fr]">
        <Sidebar />
        <main className="p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
