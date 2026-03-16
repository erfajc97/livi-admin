import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminLayout } from '@/app/layout/AdminLayout'
import { Outlet } from '@tanstack/react-router'
import NotFoundPage from '@/app/components/NotFound/NotFoundPage'

export const Route = createFileRoute('/_authenticated')({
   beforeLoad: ({ context }) => {
    if (!context.auth.isLogged()) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: () => <AdminLayout children={<Outlet />} />,
  notFoundComponent: () => (
    <NotFoundPage text="Pagina no encontrada" codeError={404} />
  ),
})
