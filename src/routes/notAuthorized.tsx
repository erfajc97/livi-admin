import { createFileRoute } from '@tanstack/react-router'
import NotFoundPage from '@/app/components/NotFound/NotFoundPage'

export const Route = createFileRoute('/notAuthorized')({
  component: () => <NotFoundPage text="Acceso no autorizado" codeError={401} />,
})
