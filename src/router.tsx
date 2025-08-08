import { createRootRoute, createRoute, createRouter, redirect } from '@tanstack/react-router'
import DashboardLayout from './layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import Units from './pages/Units'
import Leases from './pages/Leases'
import Maintenance from './pages/Maintenance'
import Tenants from './pages/Tenants'
import Invites from './pages/Invites'
import Settings from './pages/Settings'
import Login from './pages/Login'
import RegisterOrg from './pages/RegisterOrg'
import AcceptInvite from './pages/AcceptInvite'
import Onboarding from './pages/Onboarding'

const rootRoute = createRootRoute()

function requireAuth(){ const token = localStorage.getItem('token'); if(!token) throw redirect({ to: '/login' }) }
function requireRole(roles: string[]){ return () => { requireAuth(); const role = localStorage.getItem('role') || ''; if(!roles.includes(role)) throw redirect({ to: '/' }) } }

const dashboardLayoutRoute = createRoute({ getParentRoute: () => rootRoute, id: 'dashboard-layout', component: DashboardLayout, beforeLoad: requireAuth })
const indexRoute = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/', component: Dashboard })
const propertiesRoute = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/properties', component: Properties, beforeLoad: requireRole(['Landlord','AgencyAdmin','Manager']) })
const unitsRoute = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/units', component: Units, beforeLoad: requireRole(['Landlord','AgencyAdmin','Manager']) })
const leasesRoute = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/leases', component: Leases, beforeLoad: requireRole(['Landlord','AgencyAdmin','Manager','Tenant']) })
const maintenanceRoute = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/maintenance', component: Maintenance })
const tenantsRoute = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/tenants', component: Tenants, beforeLoad: requireRole(['Landlord','AgencyAdmin','Manager']) })
const invitesRoute = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/invites', component: Invites, beforeLoad: requireRole(['Landlord','AgencyAdmin','Manager']) })
const settingsRoute = createRoute({ getParentRoute: () => dashboardLayoutRoute, path: '/settings', component: Settings })
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: Login })
const registerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/register', component: RegisterOrg })
const acceptInviteRoute = createRoute({ getParentRoute: () => rootRoute, path: '/accept-invite', component: AcceptInvite })
const onboardingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/onboarding', component: Onboarding })

const routeTree = rootRoute.addChildren([
  dashboardLayoutRoute.addChildren([ indexRoute, propertiesRoute, unitsRoute, leasesRoute, maintenanceRoute, tenantsRoute, invitesRoute, settingsRoute ]),
  loginRoute, registerRoute, acceptInviteRoute, onboardingRoute
])

export const router = createRouter({ routeTree })
declare module '@tanstack/react-router' { interface Register { router: typeof router } }
