import { Button, Card, Input } from '@heroui/react'
import { useState } from 'react'
import api from '../lib/api'
import { auth } from '../lib/auth'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
export default function AcceptInvite() {
  const [token, setToken] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await api.post('/api/auth/accept-invite', { token, displayName, password })
    auth.set(res.data.token, res.data.role, res.data.orgId)
    navigate({ to: '/' })
  }
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <Card className="w-full max-w-md p-6 grid gap-4">
        <h1 className="text-2xl font-semibold">{t('auth.acceptInvite')}</h1>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <Input label="Invite Token" value={token} onChange={e => setToken(e.target.value)} />
          <Input label={t('auth.displayName')} value={displayName} onChange={e => setDisplayName(e.target.value)} />
          <Input label={t('auth.password')} type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button color="primary" type="submit">{t('auth.acceptInvite')}</Button>
        </form>
      </Card>
    </div>
  )
}
