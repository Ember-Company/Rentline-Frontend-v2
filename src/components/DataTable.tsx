import * as React from 'react'
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'

export default function DataTable<TData extends object>({ columns, data }: { columns: ColumnDef<TData, any>[]; data: TData[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const table = useReactTable({ data, columns, state: { sorting }, onSortingChange: setSorting, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() })
  return (
    <div className="overflow-x-auto rounded-large border border-divider">
      <table className="min-w-full text-sm">
        <thead className="bg-content2">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id} className="px-4 py-3 text-left font-semibold select-none cursor-pointer" onClick={h.column.getToggleSortingHandler()}>
                  <div className="inline-flex items-center gap-1">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                    {({ asc: '↑', desc: '↓' } as any)[h.column.getIsSorted() as string] || null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(r => (
            <tr key={r.id} className="even:bg-content1">
              {r.getVisibleCells().map(c => (
                <td key={c.id} className="px-4 py-3">{flexRender(c.column.columnDef.cell, c.getContext())}</td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td className="px-4 py-6 text-foreground-500" colSpan={columns.length}>No data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
