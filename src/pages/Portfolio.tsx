import { useState } from 'react'
import {
  Button,
  Card,
  Input,
  Select,
  SelectItem,
  // Drawer components removed for property details page navigation
} from '@heroui/react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'

/**
 * Sample data for the portfolio units table.  In a real application,
 * this would come from the backend via TanStack Query.  For now we
 * include static rows to illustrate the layout from the Dribbble
 * reference.  Each row contains property info, unit details, type,
 * status, tenant name and avatar, and market rent.  The avatar and
 * property images should be replaced with real data when available.
 */
const sampleRows = [
  {
    id: '1',
    propertyName: 'Boardman Main House',
    propertyAddress: '123 3rd St NE, Boardman, 97818, US',
    propertyImage:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80',
    unit: 'A-10',
    type: 'Storage',
    status: 'Occupied',
    tenantName: 'Guy Hawkins',
    tenantAvatar:
      'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=40&q=80',
    marketRent: '$6,760',
  },
  {
    id: '2',
    propertyName: 'Greenfield Apartments',
    propertyAddress: '456 Pine St SW, Denver, CO, 80202, US',
    propertyImage:
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=200&q=80',
    unit: 'A-12',
    type: 'Studio',
    status: 'Occupied',
    tenantName: 'Bessie Cooper',
    tenantAvatar:
      'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=40&q=80',
    marketRent: '$9,800',
  },
  {
    id: '3',
    propertyName: 'Blue Sky Towers',
    propertyAddress: '1012 Maple Rd, Austin, TX, 73301, US',
    propertyImage:
      'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=200&q=80',
    unit: 'A-13',
    type: '2 BHK',
    status: 'Vacant',
    tenantName: 'Guy Hawkins',
    tenantAvatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=40&q=80',
    marketRent: '$0',
  },
  {
    id: '4',
    propertyName: 'Cedar Ridge Apartments',
    propertyAddress: '1542 Elm St, Portland, OR, 97205, US',
    propertyImage:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=200&q=80',
    unit: 'B-20',
    type: '3 BHK',
    status: 'Occupied',
    tenantName: 'Devon Lane',
    tenantAvatar:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=40&q=80',
    marketRent: '$10,000',
  },
]

export default function PortfolioPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'units' | 'properties' | 'keys' | 'equipment' | 'inspection'>('units')

  // Handler for tab click
  const handleTabClick = (tab: typeof activeTab) => {
    setActiveTab(tab)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto bg-gray-50 dark:bg-neutral-900">
        {/* Page header */}
        <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900">
          <h1 className="text-2xl font-semibold dark:text-white">
            {t('portfolio.title') || 'Portfolio'}
          </h1>
          <div className="flex gap-3">
            <Button variant="bordered" icon="upload" >
              {t('portfolio.import') || 'Import'}
            </Button>
            <Button color="primary">
              {t('portfolio.addProperty') || 'Add Property'}
            </Button>
          </div>
        </header>
        <div className="p-6 flex flex-col gap-6">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 dark:border-neutral-700">
            {['properties','units','keys','equipment','inspection'].map(tab => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab as any)}
                className={`px-2 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 dark:text-neutral-400 hover:text-primary'
                }`}
              >
                {tab === 'properties' && (t('properties.title') || 'Properties')}
                {tab === 'units' && (t('portfolio.unitsTab') || 'Units')}
                {tab === 'keys' && (t('portfolio.keysLocksTab') || 'Keys & Locks')}
                {tab === 'equipment' && (t('portfolio.equipmentTab') || 'Equipment')}
                {tab === 'inspection' && (t('portfolio.inspectionTab') || 'Inspection')}
              </button>
            ))}
          </div>
          {/* Filters */}
          {activeTab === 'units' && (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">
                  {t('portfolio.unitTotal') || 'Unit Total'} {sampleRows.length}
                </span>
                <Input
                  placeholder={t('portfolio.searchProperties') || 'Search properties…'}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-3 flex-wrap">
                <Select
                  placeholder={t('portfolio.propertyType') || 'Property Type'}
                >
                  <SelectItem key="all" value="all">{t('all') || 'All'}</SelectItem>
                  <SelectItem key="storage" value="Storage">Storage</SelectItem>
                  <SelectItem key="studio" value="Studio">Studio</SelectItem>
                  <SelectItem key="2bhk" value="2bhk">2 BHK</SelectItem>
                  <SelectItem key="3bhk" value="3bhk">3 BHK</SelectItem>
                </Select>
                <Select
                  placeholder={t('portfolio.propertyStatus') || 'Property Status'}
                >
                  <SelectItem key="allStatus" value="all">{t('all') || 'All'}</SelectItem>
                  <SelectItem key="occupied" value="Occupied">{t('statuses.Occupied') || 'Occupied'}</SelectItem>
                  <SelectItem key="vacant" value="Vacant">{t('statuses.Vacant') || 'Vacant'}</SelectItem>
                </Select>
                <Button variant="bordered">
                  {t('portfolio.filter') || 'Filter'}
                </Button>
              </div>
            </div>
          )}
          {/* Units Table */}
          {activeTab === 'units' && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-neutral-300">
                        {t('portfolio.property') || 'Property'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-neutral-300">
                        {t('portfolio.unit') || 'Unit'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-neutral-300">
                        {t('portfolio.type') || 'Type'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-neutral-300">
                        {t('portfolio.status') || 'Status'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-neutral-300">
                        {t('portfolio.tenantName') || 'Tenant Name'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-neutral-300">
                        {t('portfolio.marketRent') || 'Market Rent'}
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-neutral-300">
                        {t('portfolio.action') || 'Action'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {sampleRows.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                        <td className="px-4 py-4 flex items-center gap-3 text-sm text-gray-800 dark:text-neutral-200">
                          <img
                            src={row.propertyImage}
                            alt={row.propertyName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="min-w-0">
                            <div className="font-medium truncate">{row.propertyName}</div>
                            <div className="text-xs text-gray-500 dark:text-neutral-400 truncate">
                              {row.propertyAddress}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">{row.unit}</td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">{row.type}</td>
                        <td className="px-4 py-4 text-sm">
                          <StatusBadge status={row.status} />
                        </td>
                        <td className="px-4 py-4 text-sm flex items-center gap-2 text-gray-800 dark:text-neutral-200">
                          <img
                            src={row.tenantAvatar}
                            alt={row.tenantName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="truncate">{row.tenantName}</span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-800 dark:text-neutral-200">{row.marketRent}</td>
                        <td className="px-4 py-4 text-sm text-center">
                          <div className="flex gap-2 justify-center">
                            <Link
                              to={`/property/${row.id}`}
                              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            >
                              {t('portfolio.view') || 'View'}
                            </Link>
                            <Button size="sm" onClick={() => { /* TODO: implement edit */ }}>
                              {t('portfolio.edit') || 'Edit'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
