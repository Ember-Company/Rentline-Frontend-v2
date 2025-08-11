import React from 'react';
import { Tabs, Tab } from '@heroui/react';
import UnitsToolbar from '../components/Units/UnitsToolbar';
import UnitsTable from '../components/Units/UnitsTable';
import { useUnitsStore } from '../store/useUnitsStore';

/**
 * Units page. This page orchestrates the high‑level layout shown in the
 * product specification. It displays a tab bar for navigation within
 * portfolio management, a summary of the number of units and includes
 * filtering controls and a data table. All business logic is delegated
 * to custom hooks and stores.
 */
export default function UnitsPage(): JSX.Element {
  const unitsCount = useUnitsStore((s) => s.units.length);
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold">Portfolio</h1>
        </div>
        <Tabs
          selectedKey="units"
          aria-label="Portfolio tabs"
          variant="underlined"
          onSelectionChange={() => {
            // Tab navigation is handled at the router level. We set the
            // selectedKey explicitly to prevent uncontrolled behaviour.
          }}
        >
          <Tab key="properties" title="Properties" />
          <Tab key="units" title="Units" />
          <Tab key="keys-locks" title="Keys & Locks" />
          <Tab key="equipment" title="Equipment" />
          <Tab key="inspection" title="Inspection" />
        </Tabs>
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground-500">Unit Total {unitsCount}</span>
        </div>
      </header>
      <UnitsToolbar />
      <UnitsTable />
    </div>
  );
}