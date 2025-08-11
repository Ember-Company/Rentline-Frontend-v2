import { create } from 'zustand';
import { Unit } from '../types/unit';

/**
 * State container for rental units. Zustand is used here over React
 * `useReducer` because it allows state to be consumed outside of the
 * component hierarchy while remaining simple and type safe. It also makes
 * unit testing state updates trivial.
 */
interface UnitsState {
  /** Raw list of all units loaded from the server. */
  units: Unit[];
  /** Free‑text search term applied against property names and addresses. */
  searchTerm: string;
  /** Filter by unit type. An empty string implies no filtering. */
  propertyType: string;
  /** Filter by occupancy status. An empty string implies no filtering. */
  status: '' | 'Occupied' | 'Vacant';
  /** Get a derived list of units after applying filters. */
  filteredUnits: () => Unit[];
  /** Replace the current unit list with a new array. */
  setUnits: (units: Unit[]) => void;
  /** Update the search term. */
  setSearchTerm: (term: string) => void;
  /** Update the property type filter. */
  setPropertyType: (type: string) => void;
  /** Update the status filter. */
  setStatus: (status: '' | 'Occupied' | 'Vacant') => void;
  /** Persist modifications to a unit. */
  updateUnit: (unit: Unit) => void;
  /** Add a new unit to the list. */
  addUnit: (unit: Unit) => void;
}

export const useUnitsStore = create<UnitsState>((set, get) => ({
  // Provide a handful of realistic demo units. In a real application this
  // would be fetched from the backend. Keeping sample data here aids
  // development and test coverage until the API is implemented.
  units: [
    {
      id: '1',
      propertyName: 'Boardman Main House',
      address: '123 3rd St NE, Boardman, 97818, US',
      unitNumber: 'A‑101',
      unitType: 'Storage',
      status: 'Occupied',
      tenantName: 'Guy Hawkins',
      tenantAvatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      marketRent: '$6,760',
    },
    {
      id: '2',
      propertyName: 'Greenfield Apartments',
      address: '456 Pine St SW, Denver, CO, 80202, US',
      unitNumber: 'A‑102',
      unitType: 'Studio',
      status: 'Occupied',
      tenantName: 'Bessie Cooper',
      tenantAvatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      marketRent: '$9,800',
    },
    {
      id: '3',
      propertyName: 'Blue Sky Towers',
      address: '1012 Maple Rd, Austin, TX, 73301, US',
      unitNumber: 'A‑103',
      unitType: '2 BHK',
      status: 'Vacant',
      tenantName: undefined,
      tenantAvatarUrl: undefined,
      marketRent: '$0.00',
    },
    {
      id: '4',
      propertyName: 'Cedar Ridge Apartments',
      address: '1542 Elm St, Portland, OR, 97205, US',
      unitNumber: 'B‑203',
      unitType: '3 BHK',
      status: 'Occupied',
      tenantName: 'Devon Lane',
      tenantAvatarUrl: 'https://randomuser.me/api/portraits/men/56.jpg',
      marketRent: '$10,000',
    },
    {
      id: '5',
      propertyName: 'Crystal Bay Villas',
      address: '876 Bay Ln, San Diego, CA, 92037, US',
      unitNumber: 'PH‑1',
      unitType: 'Studio',
      status: 'Occupied',
      tenantName: 'Jane Cooper',
      tenantAvatarUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
      marketRent: '$6,530',
    },
    {
      id: '6',
      propertyName: 'Golden Valley Homes',
      address: '123 3rd St NE, Boardman, 97818, US',
      unitNumber: 'F‑106',
      unitType: 'Penthouse',
      status: 'Vacant',
      tenantName: undefined,
      tenantAvatarUrl: undefined,
      marketRent: '$0.00',
    },
    {
      id: '7',
      propertyName: 'Sunset Hills Estates',
      address: '1023 Cedar St, Houston, TX, 77002, US',
      unitNumber: 'A‑303',
      unitType: '1 BHK',
      status: 'Occupied',
      tenantName: 'Wade Warren',
      tenantAvatarUrl: 'https://randomuser.me/api/portraits/men/76.jpg',
      marketRent: '$12,300',
    },
    {
      id: '8',
      propertyName: 'Blue Sky Towers',
      address: '123 3rd St NE, Boardman, 97818, US',
      unitNumber: 'B‑102',
      unitType: 'Duplex',
      status: 'Occupied',
      tenantName: 'Jenny Wilson',
      tenantAvatarUrl: 'https://randomuser.me/api/portraits/women/71.jpg',
      marketRent: '$11,345',
    },
  ],
  searchTerm: '',
  propertyType: '',
  status: '',
  filteredUnits: () => {
    const { units, searchTerm, propertyType, status } = get();
    return units.filter((unit) => {
      const matchesSearch = searchTerm.trim()
        ? (
            unit.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            unit.address.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : true;
      const matchesType = propertyType ? unit.unitType === propertyType : true;
      const matchesStatus = status ? unit.status === status : true;
      return matchesSearch && matchesType && matchesStatus;
    });
  },
  setUnits: (units) => set({ units }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setPropertyType: (type) => set({ propertyType: type }),
  setStatus: (status) => set({ status }),
  updateUnit: (updated) =>
    set((state) => ({
      units: state.units.map((u) => (u.id === updated.id ? updated : u)),
    })),
  addUnit: (unit) =>
    set((state) => ({
      units: [...state.units, unit],
    })),
}));