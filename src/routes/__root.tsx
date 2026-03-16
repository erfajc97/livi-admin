import {
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { Toaster } from 'sonner'
import NotFoundPage from '@/app/components/NotFound/NotFoundPage'

// import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'
import type { AuthContext } from '../main'

interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  errorComponent: ({ error }) => (
    <NotFoundPage
      text="Ocurrió un error inesperado en la aplicación."
      codeError={500}
      errorDetail={error instanceof Error ? error.message : String(error)}
    />
  ),
  notFoundComponent: () => <NotFoundPage text="Página no encontrada" codeError={404} />,
})

function RootComponent() {

  return (
    <HeroUIProvider className="dark text-text bg-bg min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        <ToastProvider placement="top-right" />
        <Toaster position="top-right" />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      {/* <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          TanStackQueryDevtools,
        ]}
      /> */}
      </HeroUIProvider>
  )
}
