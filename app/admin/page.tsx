'use client'

import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice, useStore } from '@/lib/store'
import { products } from '@/lib/data'

export default function AdminDashboard() {
  const { orders } = useStore()

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)

  // Calculate most sold items
  const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {}
  orders.forEach(order => {
    order.items.forEach(item => {
      if (!productSales[item.product.id]) {
        productSales[item.product.id] = {
          name: item.product.nameAr,
          quantity: 0,
          revenue: 0,
        }
      }
      productSales[item.product.id].quantity += item.quantity
      productSales[item.product.id].revenue += item.product.wholesalePrice * item.quantity
    })
  })

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].quantity - a[1].quantity)
    .slice(0, 5)

  const stats = [
    {
      title: 'إجمالي الإيرادات',
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      color: 'text-green-500 bg-green-500/10',
    },
    {
      title: 'إجمالي الطلبات',
      value: totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      title: 'المنتجات',
      value: totalProducts.toString(),
      icon: Package,
      color: 'text-purple-500 bg-purple-500/10',
    },
    {
      title: 'إجمالي المخزون',
      value: totalStock.toLocaleString('ar-YE'),
      icon: Users,
      color: 'text-orange-500 bg-orange-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة عامة على متجرك</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>أحدث الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                لا توجد طلبات حتى الآن
              </p>
            ) : (
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                  >
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.deliveryDetails.fullName}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-accent">{formatPrice(order.total)}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.items.length} منتج
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>المنتجات الأكثر مبيعاً</CardTitle>
          </CardHeader>
          <CardContent>
            {topProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                لا توجد مبيعات حتى الآن
              </p>
            ) : (
              <div className="space-y-4">
                {topProducts.map(([id, data], index) => (
                  <div
                    key={id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary"
                  >
                    <span className="w-8 h-8 flex items-center justify-center rounded-full bg-accent/10 text-accent font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.quantity} وحدة مباعة
                      </p>
                    </div>
                    <p className="font-bold text-accent">{formatPrice(data.revenue)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
