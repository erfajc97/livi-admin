import { useState } from 'react'
import { Button, Checkbox, Input } from '@heroui/react'

interface LoginFormProps {
  handleLogin: (values: { email: string; password: string }) => void
  isLoading: boolean
}

export function LoginForm({ handleLogin, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  return (
    <div className="w-full max-w-sm">
      {/* Heading */}
      <h1 className="mb-1 font-heading text-4xl font-bold text-gray-900">
        Bienvenido
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Ingresa tu email y contraseña para iniciar sesión
      </p>

      {/* Form */}
      <form
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault()
          handleLogin({ email, password })
        }}
      >
        <Input
          label="Email"
          labelPlacement="outside"
          type="email"
          placeholder="Ingresa tu email"
          value={email}
          onValueChange={setEmail}
          variant="flat"
          radius="sm"
          isRequired
          autoComplete="email"
        />

        <Input
          label="Password"
          labelPlacement="outside"
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onValueChange={setPassword}
          variant="flat"
          radius="sm"
          isRequired
          autoComplete="current-password"
        />

        {/* Remember me + Forgot password */}
        <div className="flex items-center justify-between">
          <Checkbox
            isSelected={rememberMe}
            onValueChange={setRememberMe}
            size="sm"
            classNames={{ label: 'text-sm text-gray-600' }}
          >
            Recuérdame
          </Checkbox>
          <button
            type="button"
            className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
          >
            Olvidé la contraseña
          </button>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          radius="sm"
          className="mt-2 h-12 bg-bg-alt font-heading text-sm font-semibold uppercase tracking-widest text-text"
        >
          Iniciar Sesión
        </Button>
      </form>
    </div>
  )
}
