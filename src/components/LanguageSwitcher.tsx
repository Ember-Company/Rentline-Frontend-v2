import { Select, SelectItem } from '@heroui/react'
import { useTranslation } from 'react-i18next'
export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const current = i18n.language
  return (
    <div className="min-w-[160px]">
      <Select label={t('lang.language')} selectedKeys={[current]} onChange={(e) => i18n.changeLanguage(e.target.value)} className="max-w-xs" variant="bordered" size="sm">
        <SelectItem key="en">English</SelectItem>
        <SelectItem key="es">Español</SelectItem>
        <SelectItem key="pt">Português</SelectItem>
      </Select>
    </div>
  )
}
