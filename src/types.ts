export interface PropertyImage {
  id: string
  url: string
  caption?: string
}

export interface Unit {
  id: string
  propertyId: string
  unitNumber: string
  bedrooms?: number
  bathrooms?: number
  areaSqm?: number
  rentAmount?: number
  currency?: string
}

export interface Property {
  id: string
  organizationId: string
  name: string
  street?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
  units?: Unit[]
  images?: PropertyImage[]
  ownerUserId?: string
}

export interface Lease {
  id: string
  unitId: string
  tenantUserId: string
  startDate: string
  endDate: string
  monthlyRent: number
  status: string
}

export interface MaintenanceRequest {
  id: string
  unitId: string
  title: string
  description?: string
  status: string
  createdByUserId: string
}

export interface Tenant {
  id: string
  email: string
  displayName: string
  role: string
}

export interface Invite {
  id: string
  email: string
  role: string
  status: string
  expiresAt: string
}

export function orgTypeLabel(type: number) {
  return ({ 0: 'Landlord', 1: 'Agency' } as any)[type] ?? String(type)
}