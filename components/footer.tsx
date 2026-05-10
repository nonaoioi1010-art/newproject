'use client'

import Link from 'next/link'
import { Package, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Package className="h-8 w-8 text-accent" />
              <div className="flex flex-col">
                <span className="text-xl font-bold">جملة العم</span>
                <span className="text-xs text-primary-foreground/70">للتسوق</span>
              </div>
            </Link>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              منصة تسوق الجملة الأولى في اليمن. نوفر لك أفضل المنتجات بأسعار الجملة مع التوصيل لجميع المحافظات.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  جميع المنتجات
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  الأقسام
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  تتبع طلبك
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  تسجيل الدخول
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-4">الأقسام</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=food" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  المواد الغذائية
                </Link>
              </li>
              <li>
                <Link href="/products?category=beverages" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  المشروبات
                </Link>
              </li>
              <li>
                <Link href="/products?category=cleaning" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  مواد التنظيف
                </Link>
              </li>
              <li>
                <Link href="/products?category=electronics" className="text-sm text-primary-foreground/80 hover:text-accent transition-colors">
                  الإلكترونيات
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                <span dir="ltr">+967 772 652 212</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-foreground/80">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <span>info@jomlah-alaam.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-primary-foreground/80">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                <span>صنعاء، اليمن</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} جملة العم للتسوق. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
