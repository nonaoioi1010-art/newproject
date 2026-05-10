'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, LayoutDashboard, ShoppingBag, Settings, LogOut, Menu, ClipboardList, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useStore } from '@/lib/store'

const sidebarLinks = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'الطلبات الواردة', icon: ClipboardList },
  { href: '/admin/products', label: 'المنتجات', icon: ShoppingBag },
  { href: '/admin/categories', label: 'الأقسام', icon: FolderOpen },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, setUser } = useStore()

  useEffect(() => {
    // Check if user is admin
    if (!user?.isAdmin) {
      router.push('/damin-portal')
    }
  }, [user, router])

  const handleLogout = () => {
    setUser(null)
    router.push('/')
  }

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">جاري التحميل...</div>
      </div>
    )
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/admin" className="flex items-center gap-2">
          <Package className="h-8 w-8 text-sidebar-primary" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-sidebar-foreground">جملة العم</span>
            <span className="text-xs text-sidebar-foreground/70">لوحة التحكم</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="mb-4 px-4">
          <p className="text-sm text-sidebar-foreground/70">مرحباً</p>
          <p className="font-medium text-sidebar-foreground truncate">{user.name}</p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 ml-2" />
          تسجيل الخروج
        </Button>
        <Link href="/">
          <Button
            variant="outline"
            className="w-full mt-2 border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent"
          >
            العودة للمتجر
          </Button>
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar border-l border-sidebar-border">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-primary text-primary-foreground border-b border-border">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0 bg-sidebar">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <span className="font-bold">لوحة التحكم</span>
          <div className="w-10" />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
