import logo from '@/assets/svg/logo.svg'

interface WelcomeBannerProps {
  userName: string | null
  subtitle: string
  useBgImage?: boolean
}

export default function WelcomeBanner({
  userName,
  subtitle,
  useBgImage,
}: WelcomeBannerProps) {
  if (useBgImage) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-border min-h-[200px] flex items-center">
        <img
          src="/banner-home.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 p-8">
          <p className="text-lg text-text-muted">Bienvenido de vuelta,</p>
          <h1 className="mt-1 font-heading text-3xl font-bold uppercase tracking-wide text-text">
            {userName || 'Administrador'}
          </h1>
          <p className="mt-2 text-sm text-text-muted">{subtitle}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl min-h-[80px] flex items-center">
      <img
        src="/banner-home.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex w-full items-center justify-between px-8 py-5">
        <div>
          <h1 className="font-heading text-xl font-semibold text-text">
            Bienvenido al Dashboard {userName || 'Administrador'}!
          </h1>
          <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
        </div>
        <img src={logo} alt="NonDecants" className="hidden h-10 sm:block" />
      </div>
    </div>
  )
}
