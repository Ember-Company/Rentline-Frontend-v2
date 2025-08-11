import React from 'react';
import { IconDownload, IconPlus } from '@tabler/icons-react';
import { addToast, toast } from '@heroui/react';

/**
 * The top bar renders actions common across pages. In this implementation
 * import/export and creation actions are surfaced to the user via small
 * buttons. Additional contextual actions should be added where
 * appropriate to avoid cluttering the global navigation.
 */
export default function Topbar(): JSX.Element {
  const handleImport = () => {
    addToast({ title: 'Import triggered', description: 'Import functionality not yet implemented' });
  };
  const handleAdd = () => {
    addToast({ title: 'Add property', description: 'Add functionality not yet implemented' });
  };
  return (
    <header className="flex items-center justify-end gap-2 border-b border-divider bg-content1 px-4 py-2 shadow-sm">
      <button
        onClick={handleImport}
        className="inline-flex items-center gap-2 rounded-md border border-divider bg-content2 px-3 py-1.5 text-sm hover:bg-content3"
        aria-label="Import"
      >
        <IconDownload className="h-4 w-4" />
        <span>Import</span>
      </button>
      <button
        onClick={handleAdd}
        className="inline-flex items-center gap-2 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm hover:bg-primary/90"
        aria-label="Add property"
      >
        <IconPlus className="h-4 w-4" />
        <span>Add Property</span>
      </button>
    </header>
  );
}
