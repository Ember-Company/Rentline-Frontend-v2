export interface PropertyImage { id: string; url: string; caption?: string }
export interface Unit { id: string; propertyId: string; unitNumber: string; bedrooms?: number; bathrooms?: number; areaSqm?: number; rentAmount?: number; currency?: string }
export interface Property { id: string; organizationId: string; name: string; street?: string; city?: string; state?: string; postalCode?: string; country?: string; units?: Unit[]; images?: PropertyImage[] }
export interface Organization { id: string; organizationId: string; name: string; type: number; properties?: Property[] }
export function orgTypeLabel(type: number){ return ({0:'Landlord',1:'Agency'} as any)[type] ?? String(type) }
