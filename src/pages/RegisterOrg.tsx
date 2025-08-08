import { Button, Card, Input, Select, SelectItem } from '@heroui/react'
import { useState } from 'react'
import api from '../lib/api'
import { auth } from '../lib/auth'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
export default function RegisterOrg() {
  const [orgName, setOrgName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [orgType, setOrgType] = useState<'Landlord' | 'Agency'>('Landlord')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await api.post('/api/auth/register-org', { orgName, email, password, displayName, OrgType: orgType })
    auth.set(res.data.token, res.data.role, res.data.orgId)
    navigate({ to: '/' })
  }
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <Card className="w-full max-w-md p-6 grid gap-4">
        <h1 className="text-2xl font-semibold">{t('auth.registerOrg')}</h1>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <Input label={t('auth.orgName')} value={orgName} onChange={e => setOrgName(e.target.value)} />
          <Input label={t('auth.displayName')} value={displayName} onChange={e => setDisplayName(e.target.value)} />
          <Input label={t('auth.email')} value={email} onChange={e => setEmail(e.target.value)} />
          <Input label={t('auth.password')} type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Select label={t('auth.orgType')} selectedKeys={[orgType]} onChange={e => setOrgType(e.target.value as any)}>
            <SelectItem key="Landlord">{t('auth.landlord')}</SelectItem>
            <SelectItem key="Agency">{t('auth.agency')}</SelectItem>
          </Select>
          <Button color="primary" type="submit">{t('auth.registerOrg')}</Button>
        </form>
      </Card>
    </div>
  )
}
