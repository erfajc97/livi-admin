import type React from 'react'
import {
  Home,
  LayoutDashboard,
  ClipboardList,
  Gift,
  Receipt,
  Image,
  Bell,
  Headset,
  Settings,
  Users,
  Package,
  Wallet,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  exact?: boolean
}

export const NAV_ITEMS: Array<NavItem> = [
  { label: 'Home', to: '/', icon: Home, exact: true },
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Ordenes', to: '/ordenes', icon: ClipboardList },
  { label: 'Productos', to: '/productos', icon: Package },
  { label: 'Combos', to: '/combos', icon: Gift },
  { label: 'Ventas Manuales', to: '/ventas-manuales', icon: Receipt },
  { label: 'Finanzas', to: '/finanzas', icon: Wallet },
  { label: 'Usuarios', to: '/usuarios', icon: Users },
  { label: 'Banners', to: '/banners', icon: Image },
]

export const NAV_ITEMS_BOTTOM: Array<NavItem> = [
  { label: 'Notificaciones', to: '/notificaciones', icon: Bell },
  { label: 'Soporte', to: '/soporte', icon: Headset },
  { label: 'Ajustes', to: '/ajustes', icon: Settings },
]
