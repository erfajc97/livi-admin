import { Avatar } from '@heroui/react'
import { Menu } from 'lucide-react'
import { useAuthStore } from '@/app/store/auth/authStore'

interface AdminHeaderProps {
  onMenuOpen: () => void
}

export function AdminHeader({ onMenuOpen }: AdminHeaderProps) {
  const { userName, userEmail } = useAuthStore()

  const name = userName || 'Administrador'
  const email = userEmail || ''

  const initials = name
    .split(/[\s._-]/)
    .map((w: string) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6">
      {/* Hamburger — solo móvil */}
      <button
        type="button"
        onClick={onMenuOpen}
        className="rounded-sm p-1.5 text-text-muted transition hover:text-text lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* Lado derecho: avatar + nombre */}
      <div className="ml-auto flex items-center gap-3">
        <div className="hidden flex-col items-end sm:flex">
          <span className="text-sm font-medium text-text">{name}</span>
          <span className="text-xs text-text-muted">{email}</span>
        </div>
        <Avatar
          name={initials}
          size="sm"
          classNames={{
            base: 'bg-accent',
            name: 'text-bg font-semibold text-xs',
          }}
        />
      </div>
    </header>
  )
}
