import { Card } from '@heroui/react'
import { useTranslation } from 'react-i18next'
export default function Page(){
  const { t } = useTranslation()
  return <div className='p-6 grid gap-4'><h1 className='text-2xl font-semibold'>Tenants</h1><Card className='p-6'><p className='text-foreground-500'>{t('placeholder.comingSoon')}</p><p className='mt-2'>{t('placeholder.tenantsDesc')}</p></Card></div>
}
