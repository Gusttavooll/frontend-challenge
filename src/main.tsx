import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'
import './index.css'

async function iniciarMocks() {
  if (import.meta.env.MODE !== 'mock') return
  const { worker } = await import('./mocks/browser')
  // Só a API é mockada; a página e os assets do Vite passam direto.
  await worker.start({ onUnhandledFrame: 'bypass' })
}

const queryClient = new QueryClient({
  defaultOptions: { mutations: { retry: false } },
})

iniciarMocks().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  )
})
