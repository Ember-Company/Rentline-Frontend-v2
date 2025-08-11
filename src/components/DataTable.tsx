import * as React from 'react'
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'

/**
 * Generic data table component built on top of TanStack Table.  It accepts an
 * array of column definitions and an array of data records and renders a
 * sortable table with sensible styling using Tailwind classes.  When there
 * is no data to display, a placeholder row is shown.  Sorting state is
 * managed internally.
 */
import { useTranslation } from 'react-i18next'

export default function DataTable<TData>({
  columns,
  data,
}: {
  columns: ColumnDef<TData, any>[]
  data: TData[]
}) {
  const { t } = useTranslation()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
        <thead className="bg-gray-50 dark:bg-neutral-800">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th
                  key={h.id}
                  className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-neutral-200"
                >
                  {h.isPlaceholder ? null : (
                    <div
                      className="flex items-center gap-1 cursor-pointer select-none"
                      onClick={h.column.getToggleSortingHandler()}
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {({ asc: '↑', desc: '↓' } as any)[h.column.getIsSorted() as string] || null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-4 py-2 text-sm text-gray-800 dark:text-neutral-200"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-4 text-center text-sm text-gray-600 dark:text-neutral-400"
              >
                {t('noData') || 'No data'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}