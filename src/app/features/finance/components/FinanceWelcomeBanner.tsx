import { Button } from '@heroui/react'

interface FinanceWelcomeBannerProps {
  title: string
  subtitle: string
  buttonLabel: string
  onButtonPress: () => void
}

export default function FinanceWelcomeBanner({
  title,
  subtitle,
  buttonLabel,
  onButtonPress,
}: FinanceWelcomeBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-bg via-surface to-bg p-6">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -right-10 -top-10 h-40 w-40 rotate-45 bg-accent/30" />
        <div className="absolute -right-5 top-0 h-32 w-32 rotate-12 bg-accent/20" />
      </div>
      <div className="relative flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-text">{title}</h1>
          <p className="mt-1 text-sm text-text-muted">{subtitle}</p>
        </div>
        <Button color="danger" variant="solid" onPress={onButtonPress} className="font-semibold">
          {buttonLabel}
        </Button>
      </div>
    </div>
  )
}
