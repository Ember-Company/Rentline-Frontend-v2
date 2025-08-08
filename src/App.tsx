import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import { HeroUIProvider } from '@heroui/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './queries/queryClient'
import './styles/index.css'
import './i18n'

export default function App() {
  return (
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HeroUIProvider>
  )
}
