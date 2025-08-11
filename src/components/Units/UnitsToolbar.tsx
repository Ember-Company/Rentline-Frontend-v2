import React from 'react';
import { Input, Select, SelectItem, Button } from '@heroui/react';
import { IconSearch, IconFilter } from '@tabler/icons-react';
import { useUnitsStore } from '../../store/useUnitsStore';

/**
 * Toolbar for the units table. It exposes search and filter controls
 * allowing users to narrow down the list of units. The state is stored
 * centrally in the units store so that other components (e.g. table) can
 * derive filtered results without re‑implementing the filtering logic.
 */
export default function UnitsToolbar(): JSX.Element {
  const searchTerm = useUnitsStore((s) => s.searchTerm);
  const propertyType = useUnitsStore((s) => s.propertyType);
  const status = useUnitsStore((s) => s.status);
  const setSearchTerm = useUnitsStore((s) => s.setSearchTerm);
  const setPropertyType = useUnitsStore((s) => s.setPropertyType);
  const setStatus = useUnitsStore((s) => s.setStatus);

  // Options could be generated from available units but are hard coded for
  // clarity. If additional unit types are introduced the options list
  // should be centralised in a constant.
  const typeOptions = [
    { value: '', label: 'All types' },
    { value: 'Studio', label: 'Studio' },
    { value: '1 BHK', label: '1 BHK' },
    { value: '2 BHK', label: '2 BHK' },
    { value: '3 BHK', label: '3 BHK' },
    { value: 'Penthouse', label: 'Penthouse' },
    { value: 'Duplex', label: 'Duplex' },
    { value: 'Storage', label: 'Storage' },
  ];
  const statusOptions = [
    { value: '', label: 'All statuses' },
    { value: 'Occupied', label: 'Occupied' },
    { value: 'Vacant', label: 'Vacant' },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
      <div className="flex w-full md:max-w-md items-center gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          placeholder="Search properties"
          startContent={<IconSearch className="h-4 w-4 text-foreground-500" />}
          aria-label="Search properties"
        />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Select
          selectedKey={propertyType}
          onChange={(keys) => setPropertyType(keys.currentKey as string)}
          aria-label="Property Type"
        >
          {typeOptions.map((opt) => (
            <SelectItem key={opt.value}>{opt.label}</SelectItem>
          ))}
        </Select>
        <Select
          selectedKey={status}
          onChange={(keys) => setStatus(keys.currentKey as '' | 'Occupied' | 'Vacant')}
          aria-label="Property Status"
        >
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value}>{opt.label}</SelectItem>
          ))}
        </Select>
        <Button
          variant="ghost"
          startContent={<IconFilter className="h-4 w-4" />}
          onPress={() => {
            // Filtering occurs reactively via the store; pressing the
            // button can be used to trigger analytics or additional UI
            // but is otherwise a no‑op.
          }}
        >
          Filter
        </Button>
      </div>
    </div>
  );
}