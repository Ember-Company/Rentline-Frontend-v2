import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { Outlet } from '@tanstack/react-router'
export default function DashboardLayout() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr]">
      <Topbar />
      <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr]">
        <Sidebar />
        <main className="p-2 md:p-6"><Outlet /></main>
      </div>
    </div>
  )
}
