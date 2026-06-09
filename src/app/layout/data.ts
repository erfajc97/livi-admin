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
  Layers,
  Shapes,
  FileText,
  LayoutGrid,
  Ticket,
  Warehouse,
  Megaphone,
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
  { label: 'Inventario', to: '/stock', icon: Warehouse },
  { label: 'Categorías', to: '/categorias', icon: Layers },
  { label: 'Combos', to: '/combos', icon: Gift },
  { label: 'Cupones', to: '/cupones', icon: Ticket },
  { label: 'Ventas Manuales', to: '/ventas-manuales', icon: Receipt },
  { label: 'Finanzas', to: '/finanzas', icon: Wallet },
  { label: 'Usuarios', to: '/usuarios', icon: Users },
  { label: 'Banners', to: '/banners', icon: Image },
  { label: 'Publicidad navbar', to: '/publicidad-navbar', icon: Megaphone },
  { label: 'Blog', to: '/blog', icon: FileText },
  { label: 'Landing Sections', to: '/secciones-landing', icon: LayoutGrid },
]

export const NAV_ITEMS_BOTTOM: Array<NavItem> = [
  { label: 'Ajustes', to: '/ajustes', icon: Settings },
]
