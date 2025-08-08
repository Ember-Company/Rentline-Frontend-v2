import { Navbar, NavbarBrand, NavbarContent, Button } from '@heroui/react'
import LanguageSwitcher from './LanguageSwitcher'
import ThemeToggle from './ThemeToggle'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { auth } from '../lib/auth'
export default function Topbar() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  return (
    <Navbar maxWidth="full" className="border-b border-divider">
      <NavbarBrand><span className="font-semibold tracking-wide">Rentline</span></NavbarBrand>
      <NavbarContent justify="end" className="items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        <Button size="sm" variant="flat" onPress={() => { auth.clear(); navigate({ to: '/login' })}}>
          {t('app.logout')}
        </Button>
      </NavbarContent>
    </Navbar>
  )
}
