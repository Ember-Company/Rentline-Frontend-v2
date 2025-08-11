import React from 'react';
import { useUnitsStore } from '../../store/useUnitsStore';
import { Unit } from '../../types/unit';
import { Table, Avatar, Chip, Button, TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell } from '@heroui/react';
import { IconEye, IconPencil } from '@tabler/icons-react';

/**
 * A table that renders a collection of units. It subscribes to the
 * `filteredUnits` selector on the units store so that it automatically
 * updates when filters change. Each row displays key attributes and
 * actions. The table avoids hard‑coding text by using descriptive
 * properties and accessible labels on buttons.
 */
export default function UnitsTable(): JSX.Element {
  const units = useUnitsStore((s) => s.filteredUnits());

  const renderStatus = (status: Unit['status']) => (
    <Chip
      color={status === 'Occupied' ? 'success' : 'warning'}
      variant="light"
      className="capitalize"
    >
      {status}
    </Chip>
  );

  return (
    <div className="overflow-x-auto">
      <Table aria-label="Units table">
        <TableHeader>
          <TableColumn key="property">Property</TableColumn>
          <TableColumn key="unitNumber">Unit</TableColumn>
          <TableColumn key="unitType">Type</TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="tenant">Tenant</TableColumn>
          <TableColumn key="marketRent">Market Rent</TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"No units match your filters"}>
          {units.map((unit) => (
            <TableRow key={unit.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">{unit.propertyName}</span>
                  <span className="text-xs text-foreground-500 truncate max-w-[200px]">
                    {unit.address}
                  </span>
                </div>
              </TableCell>
              <TableCell className="whitespace-nowrap">{unit.unitNumber}</TableCell>
              <TableCell className="whitespace-nowrap">{unit.unitType}</TableCell>
              <TableCell>{renderStatus(unit.status)}</TableCell>
              <TableCell>
                {unit.tenantName ? (
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={unit.tenantAvatarUrl}
                      name={unit.tenantName}
                      size="sm"
                      aria-label={`Avatar for ${unit.tenantName}`}
                    />
                    <span className="text-sm">{unit.tenantName}</span>
                  </div>
                ) : (
                  <span className="text-foreground-500 text-sm">—</span>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap">{unit.marketRent}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    startContent={<IconEye className="h-4 w-4" />}
                    aria-label={`View ${unit.propertyName} ${unit.unitNumber}`}
                    onPress={() => {
                      // In a real app this would navigate to a detail page
                    }}
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    startContent={<IconPencil className="h-4 w-4" />}
                    aria-label={`Edit ${unit.propertyName} ${unit.unitNumber}`}
                    onPress={() => {
                      // In a real app this would open a modal for editing
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
