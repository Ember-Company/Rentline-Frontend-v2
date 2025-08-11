import axios from 'axios'

/**
 * Axios instance configured for the Rentline API.  The base URL is
 * determined from the Vite environment variable `VITE_API_URL` at build
 * time, falling back to `http://localhost:5000` if undefined.  A request
 * interceptor injects the JWT bearer token from localStorage onto every
 * outgoing request.  A response interceptor clears auth state and
 * redirects to the login page if a 401 response is encountered.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
})

// Attach bearer token on each request if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    ;(config.headers as any).Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth expiration globally
api.interceptors.response.use(
  res => res,
  err => {
    if (err?.response?.status === 401) {
      // clear stored auth and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('orgId')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

export default api