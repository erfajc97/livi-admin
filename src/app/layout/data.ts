import type React from 'react'
import {
  Home,
  LayoutDashboard,
  ClipboardList,
  Settings,
  Users,
  Package,
  Layers,
  FileText,
  Ticket,
  LayoutGrid,
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
  { label: 'Categorías', to: '/categorias', icon: Layers },
  { label: 'Cupones', to: '/cupones', icon: Ticket },
  { label: 'Usuarios', to: '/usuarios', icon: Users },
  { label: 'Blog', to: '/blog', icon: FileText },
  // Secciones del home (Más vendidos, etc.): se pintan en la web desde aquí.
  { label: 'Landing Sections', to: '/secciones-landing', icon: LayoutGrid },
  // Imagen destacada del mega menú del navbar (panel "Destacado").
  { label: 'Publicidad navbar', to: '/publicidad-navbar', icon: Megaphone },
  // Ocultas para LIVI (se conservan las rutas y el código):
  // { label: 'Inventario', to: '/stock', icon: Warehouse },
  // { label: 'Combos', to: '/combos', icon: Gift },
  // { label: 'Ventas Manuales', to: '/ventas-manuales', icon: Receipt },
  // { label: 'Banners', to: '/banners', icon: Image },
  // { label: 'Finanzas', to: '/finanzas', icon: Wallet },
]

export const NAV_ITEMS_BOTTOM: Array<NavItem> = [
  { label: 'Ajustes', to: '/ajustes', icon: Settings },
]
