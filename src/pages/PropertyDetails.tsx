import { useParams } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'
import { usePropertyDetails } from '../queries/propertyDetails'
import {
  Card,
  Skeleton,
  Button,
} from '@heroui/react'

/**
 * A page that displays detailed information about a single property.  It
 * fetches property details from the backend using the property ID from
 * the route parameters.  If the backend endpoint is not yet
 * implemented, it falls back to a static sample.  The layout loosely
 * follows the dribbble reference: a header with the property name
 * and image, followed by a table of units with tenant and rent
 * information.  Additional sections can be added as the backend
 * evolves (e.g. maintenance history, financial summary, documents).
 */
export default function PropertyDetailsPage() {
  const { t } = useTranslation()
  const params = useParams({ from: '/property/:id' }) as { id?: string }
  const propertyId = params?.id
  const { data, isLoading } = usePropertyDetails(propertyId)

  // Fallback static data for development until backend endpoint exists
  const sample = {
    id: propertyId,
    name: 'Boardman Main House',
    address: '123 3rd St NE, Boardman, 97818, US',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
    type: 'House',
    status: 'Occupied',
    description: 'A charming single-family home located in Boardman with easy access to schools and parks.',
    units: [
      {
        id: 'u1',
        unitNumber: 'A-10',
        type: 'Storage',
        status: 'Occupied',
        tenantName: 'Guy Hawkins',
        tenantAvatar:
          'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=40&q=80',
        marketRent: '$6,760',
      },
      {
        id: 'u2',
        unitNumber: 'A-12',
        type: 'Studio',
        status: 'Vacant',
        tenantName: '',
        tenantAvatar: '',
        marketRent: '$0',
      },
    ],
  }

  const property = data || sample

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50 dark:bg-neutral-900">
        {/* Header */}
        <header className="flex items-center gap-4 p-6 border-b border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-4">
            <img
              src={property?.image}
              alt={property?.name}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-2xl font-semibold dark:text-white">
                {property?.name || t('propertyDetails.name') || 'Property Name'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                {property?.address || t('propertyDetails.address') || 'Address'}
              </p>
            </div>
          </div>
          <div className="ml-auto space-x-2">
            <Button variant="outline">{t('portfolio.edit') || 'Edit'}</Button>
            {/* Additional actions could go here */}
          </div>
        </header>
        <div className="p-6 space-y-6">
          {/* Property summary */}
          <Card className="p-4">
            {isLoading ? (
              <Skeleton className="h-32" />
            ) : (
              <>
                <h2 className="text-xl font-medium mb-4 dark:text-white">
                  {t('propertyDetails.info') || 'Property Information'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                      {t('propertyDetails.type') || 'Type'}
                    </h3>
                    <p className="text-base text-gray-800 dark:text-neutral-200">
                      {property?.type}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                      {t('propertyDetails.status') || 'Status'}
                    </h3>
                    <StatusBadge status={property?.status || 'Vacant'} />
                  </div>
                  <div className="sm:col-span-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                      {t('propertyDetails.description') || 'Description'}
                    </h3>
                    <p className="text-base text-gray-800 dark:text-neutral-200">
                      {property?.description}
                    </p>
                  </div>
                </div>
              </>
            )}
          </Card>
          {/* Units table */}
          <Card className="p-0">
            <div className="p-4">
              <h2 className="text-xl font-medium dark:text-white">
                {t('propertyDetails.units') || 'Units'}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                <thead className="bg-gray-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-neutral-300">
                      {t('portfolio.unit') || 'Unit'}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-neutral-300">
                      {t('portfolio.type') || 'Type'}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-neutral-300">
                      {t('portfolio.status') || 'Status'}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-neutral-300">
                      {t('portfolio.tenantName') || 'Tenant Name'}
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 dark:text-neutral-300">
                      {t('portfolio.marketRent') || 'Market Rent'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                  {(property?.units || []).map((unit: any) => (
                    <tr key={unit.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-neutral-200">
                        {unit.unitNumber}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-neutral-200">
                        {unit.type}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge status={unit.status} />
                      </td>
                      <td className="px-4 py-3 text-sm flex items-center gap-2 text-gray-800 dark:text-neutral-200">
                        {unit.tenantAvatar ? (
                          <img
                            src={unit.tenantAvatar}
                            alt={unit.tenantName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <span className="w-6 h-6 rounded-full bg-gray-300 dark:bg-neutral-700" />
                        )}
                        <span>{unit.tenantName || '-'}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 dark:text-neutral-200">
                        {unit.marketRent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}