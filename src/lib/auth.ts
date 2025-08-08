export type Role = 'Landlord' | 'AgencyAdmin' | 'Manager' | 'Maintenance' | 'Tenant' | 'Viewer'
export const auth = {
  set(token: string, role: Role, orgId: string) { localStorage.setItem('token', token); localStorage.setItem('role', role); localStorage.setItem('orgId', orgId) },
  clear() { localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('orgId') },
  token() { return localStorage.getItem('token') },
  role() { return localStorage.getItem('role') as Role | null },
  orgId() { return localStorage.getItem('orgId') }
}
