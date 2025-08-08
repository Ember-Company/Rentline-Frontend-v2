import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000' })
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    ;(config.headers as any).Authorization = `Bearer ${token}`
  }
  return config
})
api.interceptors.response.use(r => r, e => {
  if (e?.response?.status === 401) {
    localStorage.removeItem('token'); localStorage.removeItem('role'); localStorage.removeItem('orgId')
    window.location.href = '/login'
  }
  return Promise.reject(e)
})
export default api
