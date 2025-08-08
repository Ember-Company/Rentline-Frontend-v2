import { Switch } from '@heroui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
export default function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => document.documentElement.classList.contains('dark'))
  const { t } = useTranslation()
  useEffect(() => { dark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark') }, [dark])
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{t('theme.light')}</span>
      <Switch isSelected={dark} onValueChange={setDark} size="sm" />
      <span className="text-sm">{t('theme.dark')}</span>
    </div>
  )
}
