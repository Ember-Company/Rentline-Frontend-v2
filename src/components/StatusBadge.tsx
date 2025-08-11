import { useTranslation } from 'react-i18next'

/**
 * Renders a colored badge for a unit or lease status.  Colours are
 * determined by a few common statuses: Occupied/Vacant for units and
 * Pending/InProgress/Resolved for maintenance.  Additional statuses
 * fall back to a neutral style.  Uses translation keys under
 * `statuses.*`.
 */
export default function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation()
  const colourMap: Record<string, string> = {
    Occupied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400',
    Vacant: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400',
    Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-400',
    InProgress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-400',
    Resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400',
  }
  const classes = colourMap[status] ?? 'bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-neutral-200'
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${classes}`}>{t(`statuses.${status}`) || status}</span>
  )
}