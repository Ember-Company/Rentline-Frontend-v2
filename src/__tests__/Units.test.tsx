import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { HeroUIProvider } from '@heroui/react';
import UnitsPage from '../pages/Units';
import { useUnitsStore } from '../store/useUnitsStore';

// Helper to render a component within necessary providers.
function renderWithProviders(ui: React.ReactElement) {
  return render(<HeroUIProvider>{ui}</HeroUIProvider>);
}

describe('UnitsPage', () => {
  beforeEach(() => {
    // Reset the store before each test to ensure determinism.
    const initial = useUnitsStore.getState().units;
    useUnitsStore.setState({
      searchTerm: '',
      propertyType: '',
      status: '',
      units: [...initial],
    });
  });

  it('renders the units table with all rows', () => {
    renderWithProviders(<UnitsPage />);
    // Heading
    const heading = screen.getByRole('heading', { name: 'Portfolio' });
    expect(heading).toBeInTheDocument();
    // Tabs – Units tab should be present
    const unitsTab = screen.getByRole('tab', { name: 'Units' });
    expect(unitsTab).toHaveAttribute('aria-selected', 'true');
    // Table rows – skip header row by using getAllByRole with row and >1
    const rows = screen.getAllByRole('row');
    // There is one header row plus as many rows as units.
    const unitsCount = useUnitsStore.getState().units.length;
    expect(rows.length).toBe(unitsCount + 1);
  });

  it('filters units by search term', () => {
    renderWithProviders(<UnitsPage />);
    const searchInput = screen.getByRole('textbox', { name: 'Search properties' });
    fireEvent.change(searchInput, { target: { value: 'Greenfield' } });
    // After changing the search term, only matching rows should be rendered.
    const rows = screen.getAllByRole('row');
    // header + one matching unit
    expect(rows.length).toBe(2);
    const cell = within(rows[1]).getByText(/Greenfield Apartments/i);
    expect(cell).toBeInTheDocument();
  });

  it('filters units by status', () => {
    renderWithProviders(<UnitsPage />);
    const statusSelect = screen.getByRole('button', { name: /All statuses/i });
    // Open the select menu
    fireEvent.click(statusSelect);
    const vacantOption = screen.getByRole('option', { name: 'Vacant' });
    fireEvent.click(vacantOption);
    // Now only vacant rows should be visible
    const rows = screen.getAllByRole('row');
    // header + number of vacant units
    const expectedCount = useUnitsStore.getState().units.filter((u) => u.status === 'Vacant').length;
    expect(rows.length).toBe(expectedCount + 1);
    // Ensure all rendered statuses show Vacant
    rows.slice(1).forEach((row) => {
      const statusChip = within(row).getByText(/Vacant|Occupied/i);
      expect(statusChip.textContent).toBe('Vacant');
    });
  });
});