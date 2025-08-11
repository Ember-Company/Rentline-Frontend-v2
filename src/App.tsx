import React from 'react';
import { HeroUIProvider } from '@heroui/react';
import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {ToastProvider} from "@heroui/toast";
import { router } from './router';
import './styles/index.css'

/**
 * The root of the application. It wires together global providers such as
 * HeroUI, React Query and the router. Each provider is configured with
 * sensible defaults and composed in a deterministic order. Additional
 * providers should be added here rather than in `main.tsx` to keep the
 * entrypoint simple and the provider tree explicit.
 */
export default function App(): JSX.Element {
  const queryClient = React.useMemo(() => new QueryClient(), []);
  return (
    <HeroUIProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider />
        <RouterProvider router={router} />
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
