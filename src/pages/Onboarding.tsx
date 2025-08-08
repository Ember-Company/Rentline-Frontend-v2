import { Button, Card } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
export default function Onboarding() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-3xl p-6 grid gap-6">
      <h1 className="text-3xl font-semibold">{t('onboarding.title')}</h1>
      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="p-6 grid gap-4">
          <h2 className="text-xl font-semibold">{t('auth.landlord')}</h2>
          <p className="text-foreground-500">Set up your organization and start managing your portfolio.</p>
          <Button color="primary" onPress={() => navigate({ to: '/register' })}>{t('onboarding.landlordCta')}</Button>
        </Card>
        <Card className="p-6 grid gap-4">
          <h2 className="text-xl font-semibold">{t('auth.tenant')}</h2>
          <p className="text-foreground-500">Join via invite token to access your tenant portal.</p>
          <Button variant="flat" onPress={() => navigate({ to: '/accept-invite' })}>{t('onboarding.tenantCta')}</Button>
        </Card>
      </div>
    </div>
  )
}
