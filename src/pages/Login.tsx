import { Button, Card, Input } from '@heroui/react'
import { useState } from 'react'
import api from '../lib/api'
import { auth } from '../lib/auth'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { t } = useTranslation()
  const navigate = useNavigate()
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await api.post('/api/auth/login', { email, password })
    auth.set(res.data.token, res.data.role, res.data.orgId)
    navigate({ to: '/' })
  }
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <Card className="w-full max-w-md p-6 grid gap-4">
        <h1 className="text-2xl font-semibold">{t('auth.login')}</h1>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <Input label={t('auth.email')} value={email} onChange={e => setEmail(e.target.value)} />
          <Input label={t('auth.password')} type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button color="primary" type="submit">{t('auth.login')}</Button>
        </form>
        <Button variant="light" onPress={() => navigate({ to: '/register' })}>{t('auth.registerOrg')}</Button>
      </Card>
    </div>
  )
}
