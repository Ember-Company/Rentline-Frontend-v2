import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import DashboardLayout from './layout/DashboardLayout';
import UnitsPage from './pages/Units';
import PropertiesPage from './pages/Properties';

// The root route defines top-level layout and authentication guards.  In this
// example we do not implement authentication logic; however, the structure
// remains extensible. To add protected routes, attach a `beforeLoad`
// function that throws via `redirect()` when the user is unauthenticated.
const rootRoute = createRootRoute();

// Compose the dashboard layout. All authenticated pages live under this
// route. Additional pages can be added here as required.
const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'dashboard-layout',
  component: DashboardLayout,
});

// Define individual pages. Each page is lazy-evaluated to minimise bundle
// size. The `path` values map to the URLs exposed to users.
const unitsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/units',
  component: UnitsPage,
});
const propertiesRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/properties',
  component: PropertiesPage,
});
const indexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: '/',
  component: UnitsPage,
});

// Assemble the tree. Additional standalone routes (e.g. login) can be
// appended here outside of the dashboard layout.
const routeTree = rootRoute.addChildren([
  dashboardLayoutRoute.addChildren([indexRoute, propertiesRoute, unitsRoute]),
]);

export const router = createRouter({ routeTree });
// Augment type generation for the router to improve inference in hooks.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}