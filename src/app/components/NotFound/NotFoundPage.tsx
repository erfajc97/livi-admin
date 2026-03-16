import { Button } from '@heroui/react'
import { useNavigate } from '@tanstack/react-router'
import { FaArrowLeftLong } from 'react-icons/fa6'
import { useAuthStore } from '@/app/store/auth/authStore'
import { useLogoutMutation } from '@/app/features/auth/mutations/useLogoutMutation'
import logo from '@/assets/svg/logo.svg'

interface NotFoundPageProps {
  text: string
  codeError: number
  errorDetail?: string
}

const NotFoundPage = ({ text, codeError, errorDetail }: NotFoundPageProps) => {
  const { mutateAsync: logout } = useLogoutMutation()
  const { token } = useAuthStore()
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    await logout()
    navigate({ to: '/' })
  }

  const handleGoBack = () => {
    navigate({ to: '/' })
  }

  return (
    <div className="flex flex-col items-center justify-center text-center h-[calc(100vh-90px)] sm:h-[calc(100vh-120px)] relative bg-black rounded-2xl">
      <div className="relative z-1">
        <div className="flex items-center justify-center">
         <img src={logo} alt="Logo" className="w-80 h-30" />
        </div>
        <h1 className="text-6xl sm:text-7xl font-bold text-primary ">
          {codeError}
        </h1>

        <p className="text-base sm:text-lg font-medium text-primary mt-2 mb-2 sm:mb-3">
          {text}
        </p>
        {errorDetail && (
          <p className="text-xs sm:text-sm text-text-muted mb-4 sm:mb-5 max-w-md mx-auto wrap-break-word px-4">
            {errorDetail}
          </p>
        )}
        <div className="flex items-center justify-center gap-x-3">
          {token && (
            <Button
              variant="flat"
              onPress={handleGoBack}
              startContent={<FaArrowLeftLong className='text-white' />}
            >
              <p className='text-white'>
                Ir atras
              </p>
            </Button>
          )}
          <Button
            onPress={handleLogout}
            className="text-xs sm:text-sm px-5 py-2 font-medium text-white! bg-primary rounded-lg hover:bg-primary/85 duration-200"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
