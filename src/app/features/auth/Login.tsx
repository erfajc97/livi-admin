import { LoginForm } from './components/LoginForm'
import { useLoginHook } from './hooks/useLoginHook'

export function Login() {
  const { handleLogin, isPending } = useLoginHook()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left — formulario */}
      <div className="light flex w-full flex-col items-center justify-center overflow-y-auto bg-white px-6 py-8 sm:px-10 lg:w-[42%] lg:overflow-hidden lg:py-0">
        <LoginForm handleLogin={handleLogin} isLoading={isPending} />
      </div>

      {/* Right — banner (solo desktop) */}
      <div className="relative hidden lg:block lg:w-[58%]">
        <img
          src="/baner-login.jpg"
          alt="Taller LIVI — artesano trabajando el cuero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-10 left-10">
          <span className="font-heading text-5xl font-bold uppercase tracking-widest text-white drop-shadow-lg">
            LIVI
          </span>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-white/80">
            For Modern Parenthood
          </p>
        </div>
      </div>
    </div>
  )
}
