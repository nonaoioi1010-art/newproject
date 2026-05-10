'use client'

import Link from 'next/link'
import { Package, Clock, CheckCircle, XCircle, Truck, ArrowLeft, ArrowRight } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSlideOver } from '@/components/cart-slide-over'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatPrice, useStore } from '@/lib/store'
import { format } from 'date-fns'
import { ar } from 'date-fns/locale'

const statusConfig = {
  pending: {
    label: 'قيد الانتظار',
    icon: Clock,
    color: 'text-yellow-500 bg-yellow-500/10',
  },
  confirmed: {
    label: 'مؤكد',
    icon: CheckCircle,
    color: 'text-blue-500 bg-blue-500/10',
  },
  delivered: {
    label: 'تم التوصيل',
    icon: Truck,
    color: 'text-green-500 bg-green-500/10',
  },
  cancelled: {
    label: 'ملغي',
    icon: XCircle,
    color: 'text-red-500 bg-red-500/10',
  },
}

export default function OrdersPage() {
  const { orders, user } = useStore()

  const userOrders = orders.filter(
    (order) => order.userId === user?.id || order.userId === 'guest'
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowRight className="h-4 w-4" />
            <span>العودة للرئيسية</span>
          </Link>

          <h1 className="text-3xl font-bold mb-8">طلباتي</h1>

          {userOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-4">لا توجد طلبات</h2>
              <p className="text-muted-foreground mb-6">
                لم تقم بأي طلبات بعد. ابدأ التسوق الآن!
              </p>
              <Link href="/products">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  تصفح المنتجات
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map((order) => {
                const status = statusConfig[order.status]
                const StatusIcon = status.icon

                return (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg">
                            طلب #{order.id}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {format(new Date(order.createdAt), 'PPP', { locale: ar })}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${status.color}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">{status.label}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Order Items */}
                      <div className="space-y-3 mb-6">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.product.id} className="flex items-center gap-3 text-sm">
                            <span className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-xs font-medium">
                              ×{item.quantity}
                            </span>
                            <span className="flex-1 truncate">{item.product.nameAr}</span>
                            <span className="text-muted-foreground">
                              {formatPrice(item.product.wholesalePrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-sm text-muted-foreground">
                            +{order.items.length - 3} منتجات أخرى
                          </p>
                        )}
                      </div>

                      {/* Order Total */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <p className="text-sm text-muted-foreground">الإجمالي</p>
                          <p className="text-xl font-bold text-accent">{formatPrice(order.total)}</p>
                          {order.discount > 0 && (
                            <p className="text-xs text-green-600">
                              وفرت {formatPrice(order.discount)}
                            </p>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-muted-foreground">التوصيل إلى</p>
                          <p className="text-sm font-medium">{order.deliveryDetails.fullName}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {order.deliveryDetails.address}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartSlideOver />
    </div>
  )
}
