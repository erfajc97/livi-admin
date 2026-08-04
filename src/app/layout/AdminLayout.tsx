import { useState } from 'react'
import { AdminSidebar } from './components/AdminSidebar'
import { AdminHeader } from './components/AdminHeader'

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Columna principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader onMenuOpen={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
