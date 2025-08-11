/**
 * A rental unit represents a distinct rentable space within a property. It
 * includes identifying information, its current occupancy status and
 * financial details. Having a first‑class type makes it easy to reason
 * about the shape of units throughout the application.
 */
export interface Unit {
  /** Unique identifier for the unit (could be a UUID). */
  id: string;
  /** A descriptive name for the property this unit belongs to. */
  propertyName: string;
  /** A human‑readable address. */
  address: string;
  /** The unit number or designation (e.g. A‑101). */
  unitNumber: string;
  /** A free‑form description of the unit type (e.g. Studio, 2 BHK). */
  unitType: string;
  /** Current occupancy status. */
  status: 'Occupied' | 'Vacant';
  /** The name of the primary tenant, if occupied. */
  tenantName?: string;
  /** A URL pointing at the tenant's avatar image. */
  tenantAvatarUrl?: string;
  /** The monthly market rent in dollars. Use a string to preserve precision. */
  marketRent: string;
}