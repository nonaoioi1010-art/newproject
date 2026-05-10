'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, Search, User, Package, Settings, LogOut, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useStore } from '@/lib/store'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navLinks = [
  { href: '/', label: 'الرئيسية' },
  { href: '/products', label: 'المنتجات' },
  { href: '/categories', label: 'الأقسام' },
  { href: '/favorites', label: 'المفضلة', icon: Star },
  { href: '/orders', label: 'طلباتي' },
]

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { cart, setCartOpen, user, setUser, siteSettings } = useStore()
  
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {siteSettings?.logoUrl ? (
              <div className="relative w-10 h-10">
                <Image
                  src={siteSettings.logoUrl}
                  alt={siteSettings?.siteName || 'جملة العم'}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <Package className="h-8 w-8 text-accent" />
            )}
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight">{siteSettings?.siteName || 'جملة العم'}</span>
              <span className="text-xs text-primary-foreground/70">للتسوق</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 bg-primary-foreground text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* User */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user.name}</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        {user.email || user.phone}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="h-4 w-4" />
                          لوحة الإدارة
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center gap-2 cursor-pointer">
                      <Package className="h-4 w-4" />
                      طلباتي
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onClick={() => setUser(null)}
                  >
                    <LogOut className="h-4 w-4 ml-2" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative text-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {cartItemsCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium hover:text-accent transition-colors py-2 border-b border-border"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user ? (
                    <div className="pt-4 border-t border-border space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">مرحباً</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      {user.isAdmin && (
                        <Link href="/admin">
                          <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                            <Settings className="h-4 w-4 ml-2" />
                            لوحة الإدارة
                          </Button>
                        </Link>
                      )}
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setUser(null)}
                      >
                        <LogOut className="h-4 w-4 ml-2" />
                        تسجيل الخروج
                      </Button>
                    </div>
                  ) : (
                    <Link href="/login">
                      <Button className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                        تسجيل الدخول
                      </Button>
                    </Link>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن منتج..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 bg-primary-foreground text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
