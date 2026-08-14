import { useEffect, useState } from 'react'
import { Button, Checkbox, Input, Snippet } from '@heroui/react'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import { useResetPasswordMutation } from '../../mutations/useUserMutations'
import type { ResetPasswordResult, User } from '../../types'

interface ResetPasswordModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

const MIN_LENGTH = 8

/**
 * Restablecimiento de contraseña desde el panel (soporte por WhatsApp, cuentas
 * sin acceso al correo). El admin puede escribir una o dejar que el backend
 * genere una temporal; la contraseña resultante se muestra UNA vez porque
 * después queda hasheada.
 */
export default function ResetPasswordModal({
  isOpen,
  onOpenChange,
  user,
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState('')
  const [notify, setNotify] = useState(true)
  const [result, setResult] = useState<ResetPasswordResult | null>(null)
  const { mutate: resetPassword, isPending } = useResetPasswordMutation()

  // Cada apertura arranca limpia: dejar la contraseña anterior en pantalla
  // haría creer que sigue vigente para el usuario nuevo.
  useEffect(() => {
    if (!isOpen) return
    setPassword('')
    setNotify(true)
    setResult(null)
  }, [isOpen, user?.id])

  const isGoogle = user?.authProvider === 'google'
  const tooShort = password.length > 0 && password.length < MIN_LENGTH

  const handleSubmit = () => {
    if (!user || tooShort) return
    resetPassword(
      { id: user.id, data: { password: password || undefined, notify } },
      { onSuccess: setResult },
    )
  }

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={!isPending}
      size="md"
      headerContent={<h3>Restablecer contraseña</h3>}
      footerContent={
        result ? (
          <Button color="primary" onPress={() => onOpenChange(false)}>
            Listo
          </Button>
        ) : (
          <>
            <Button
              color="default"
              variant="flat"
              onPress={() => onOpenChange(false)}
              isDisabled={isPending}
            >
              <p className="text-text">Cancelar</p>
            </Button>
            <Button
              color="primary"
              isLoading={isPending}
              isDisabled={isGoogle || tooShort}
              onPress={handleSubmit}
            >
              Restablecer
            </Button>
          </>
        )
      }
    >
      {isGoogle ? (
        <p className="text-sm text-text-muted">
          <strong className="text-text">{user?.email}</strong> entra con Google:
          su acceso lo maneja Google y no hay contraseña nuestra que cambiar.
        </p>
      ) : result ? (
        <div className="space-y-3">
          <p className="text-sm text-text-muted">
            Contraseña nueva de{' '}
            <strong className="text-text">{result.email}</strong>. Cópiala
            ahora: al cerrar este modal ya no se puede volver a ver.
          </p>
          <Snippet
            symbol=""
            variant="bordered"
            className="w-full"
            classNames={{ pre: 'font-mono text-base text-text' }}
          >
            {result.password}
          </Snippet>
          <p className="text-xs text-text-muted">
            {result.notified
              ? 'Se le envió por correo al usuario.'
              : 'No se envió correo: tendrás que dictársela.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Asignar una contraseña nueva a{' '}
            <strong className="text-text">{user?.email}</strong>. No hace falta
            la actual.
          </p>

          <Input
            label="Contraseña nueva"
            placeholder="Déjalo vacío para generar una temporal"
            value={password}
            onValueChange={setPassword}
            variant="bordered"
            isInvalid={tooShort}
            errorMessage={
              tooShort ? `Mínimo ${MIN_LENGTH} caracteres` : undefined
            }
          />

          <Checkbox isSelected={notify} onValueChange={setNotify} size="sm">
            <span className="text-sm text-text">
              Enviarle la contraseña por correo
            </span>
          </Checkbox>
        </div>
      )}
    </CustomModalNextUI>
  )
}
