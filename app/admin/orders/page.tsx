'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Package, Search, Eye, Phone, MapPin, Clock, CheckCircle, Truck, XCircle, MessageCircle, ExternalLink, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { formatPrice, useStore, type Order } from '@/lib/store'
import { toast } from 'sonner'

const WHATSAPP_NUMBER = '967772652212' // رقم واتساب جملة العم

const statusConfig = {
  pending: { label: 'قيد الانتظار', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', icon: Clock },
  confirmed: { label: 'تم التأكيد', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', icon: CheckCircle },
  delivered: { label: 'تم التوصيل', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', icon: Truck },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', icon: XCircle },
}

// بيانات طلبات تجريبية
const mockOrders: Order[] = [
  {
    id: 'JO-ABC123',
    userId: 'user1',
    items: [
      { product: { id: '1', name: 'Rice', nameAr: 'أرز بسمتي ٢٥ كيلو', description: '', descriptionAr: '', wholesalePrice: 45000, retailPrice: 52000, minQuantity: 5, category: 'grains', categoryAr: 'الحبوب والأرز', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', stock: 500, unit: 'bag', unitAr: 'كيس' }, quantity: 10 },
      { product: { id: '2', name: 'Sugar', nameAr: 'سكر أبيض ٥٠ كيلو', description: '', descriptionAr: '', wholesalePrice: 35000, retailPrice: 40000, minQuantity: 10, category: 'grains', categoryAr: 'الحبوب والأرز', image: 'https://images.unsplash.com/photo-1550411294-098cf0a647b8?w=400', stock: 300, unit: 'bag', unitAr: 'كيس' }, quantity: 5 },
    ],
    total: 625000,
    discount: 0,
    deliveryDetails: {
      fullName: 'أحمد محمد علي',
      phone: '+967771234567',
      address: 'صنعاء - حي التحرير - شارع الزبيري',
      city: 'صنعاء',
      neighborhood: 'حي التحرير',
      street: 'شارع الزبيري',
      buildingNumber: '15',
      landmark: 'بجوار مسجد الصالح',
      latitude: 15.3694,
      longitude: 44.1910,
    },
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // قبل 30 دقيقة
  },
  {
    id: 'JO-DEF456',
    userId: 'user2',
    items: [
      { product: { id: '3', name: 'Oil', nameAr: 'زيت طبخ ١٠ لتر', description: '', descriptionAr: '', wholesalePrice: 28000, retailPrice: 32000, minQuantity: 3, category: 'oils', categoryAr: 'الزيوت', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400', stock: 200, unit: 'gallon', unitAr: 'جالون' }, quantity: 20 },
    ],
    total: 560000,
    discount: 56000,
    deliveryDetails: {
      fullName: 'خالد عبدالله',
      phone: '+967772345678',
      address: 'عدن - كريتر - شارع العيدروس',
      city: 'عدن',
      neighborhood: 'كريتر',
      street: 'شارع العيدروس',
      buildingNumber: '8',
      latitude: 12.7855,
      longitude: 45.0187,
    },
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // قبل ساعتين
  },
  {
    id: 'JO-GHI789',
    userId: 'user3',
    items: [
      { product: { id: '4', name: 'Flour', nameAr: 'دقيق أبيض ٥٠ كيلو', description: '', descriptionAr: '', wholesalePrice: 22000, retailPrice: 26000, minQuantity: 5, category: 'grains', categoryAr: 'الحبوب والأرز', image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400', stock: 400, unit: 'bag', unitAr: 'كيس' }, quantity: 15 },
    ],
    total: 330000,
    discount: 0,
    deliveryDetails: {
      fullName: 'محمد سالم',
      phone: '+967773456789',
      address: 'تعز - حي الحوبان',
      city: 'تعز',
      neighborhood: 'حي الحوبان',
    },
    status: 'delivered',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // قبل يوم
  },
]

export default function AdminOrdersPage() {
  const { orders: storeOrders } = useStore()
  const [orders, setOrders] = useState<Order[]>([...mockOrders, ...storeOrders])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.deliveryDetails.fullName.includes(searchQuery) ||
        order.deliveryDetails.phone.includes(searchQuery)
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
    toast.success('تم تحديث حالة الطلب')
  }

  const handleContactCustomer = (order: Order) => {
    const message = `مرحباً ${order.deliveryDetails.fullName}،\n\nبخصوص طلبك رقم ${order.id} من جملة العم.\n\nنود إبلاغكم بأن...`
    const whatsappUrl = `https://wa.me/${order.deliveryDetails.phone.replace('+', '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    if (diff < 1000 * 60 * 60) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `منذ ${minutes} دقيقة`
    } else if (diff < 1000 * 60 * 60 * 24) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      return `منذ ${hours} ساعة`
    } else {
      return date.toLocaleDateString('ar-YE', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  // إحصائيات الطلبات
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            <ArrowRight className="h-4 w-4 ml-2" />
            رجوع
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">الطلبات الواردة</h1>
        <p className="text-muted-foreground">إدارة ومتابعة طلبات العملاء</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">قيد الانتظار</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
            <p className="text-sm text-muted-foreground">تم التأكيد</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
            <p className="text-sm text-muted-foreground">تم التوصيل</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            <p className="text-sm text-muted-foreground">ملغية</p>
          </CardContent>
        </Card>
        <Card className="border-accent">
          <CardContent className="p-4 text-center">
            <p className="text-xl font-bold text-accent">{formatPrice(stats.totalRevenue)}</p>
            <p className="text-sm text-muted-foreground">إجمالي المبيعات</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث برقم الطلب أو اسم العميل أو رقم الهاتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="حالة الطلب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="confirmed">تم التأكيد</SelectItem>
                <SelectItem value="delivered">تم التوصيل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            قائمة الطلبات ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>المنتجات</TableHead>
                  <TableHead>الإجمالي</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status].icon
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-bold">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.deliveryDetails.fullName}</p>
                          <p className="text-sm text-muted-foreground" dir="ltr">{order.deliveryDetails.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{order.items.length} منتج</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} قطعة
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-accent">
                        {formatPrice(order.total)}
                        {order.discount > 0 && (
                          <span className="text-xs text-green-600 block">
                            خصم: -{formatPrice(order.discount)}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[order.status].color}>
                          <StatusIcon className="h-3 w-3 ml-1" />
                          {statusConfig[order.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(order)}
                            title="عرض التفاصيل"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleContactCustomer(order)}
                            title="تواصل واتساب"
                          >
                            <MessageCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>تفاصيل الطلب #{selectedOrder.id}</span>
                  <Badge className={statusConfig[selectedOrder.status].color}>
                    {statusConfig[selectedOrder.status].label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {formatDate(selectedOrder.createdAt)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Customer Info */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-accent" />
                    معلومات العميل
                  </h3>
                  <div className="bg-secondary p-4 rounded-lg space-y-2">
                    <p><strong>الاسم:</strong> {selectedOrder.deliveryDetails.fullName}</p>
                    <p dir="ltr" className="text-left"><strong className="float-right ml-2">الهاتف:</strong> {selectedOrder.deliveryDetails.phone}</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-accent" />
                    عنوان التوصيل
                  </h3>
                  <div className="bg-secondary p-4 rounded-lg space-y-2">
                    <p><strong>العنوان:</strong> {selectedOrder.deliveryDetails.address}</p>
                    {selectedOrder.deliveryDetails.city && (
                      <p><strong>المدينة:</strong> {selectedOrder.deliveryDetails.city}</p>
                    )}
                    {selectedOrder.deliveryDetails.neighborhood && (
                      <p><strong>الحي:</strong> {selectedOrder.deliveryDetails.neighborhood}</p>
                    )}
                    {selectedOrder.deliveryDetails.street && (
                      <p><strong>الشارع:</strong> {selectedOrder.deliveryDetails.street}</p>
                    )}
                    {selectedOrder.deliveryDetails.buildingNumber && (
                      <p><strong>رقم المبنى:</strong> {selectedOrder.deliveryDetails.buildingNumber}</p>
                    )}
                    {selectedOrder.deliveryDetails.landmark && (
                      <p><strong>علامة مميزة:</strong> {selectedOrder.deliveryDetails.landmark}</p>
                    )}
                    {selectedOrder.deliveryDetails.latitude && selectedOrder.deliveryDetails.longitude && (
                      <a
                        href={`https://maps.google.com/?q=${selectedOrder.deliveryDetails.latitude},${selectedOrder.deliveryDetails.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent hover:underline mt-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        فتح الموقع في خرائط جوجل
                      </a>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-accent" />
                    المنتجات المطلوبة
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div key={item.product.id} className="flex gap-3 p-3 bg-secondary rounded-lg">
                        <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.nameAr}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.product.nameAr}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × {formatPrice(item.product.wholesalePrice)}
                          </p>
                        </div>
                        <p className="font-bold text-accent">
                          {formatPrice(item.product.wholesalePrice * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Order Total */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span>{formatPrice(selectedOrder.total + selectedOrder.discount)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم</span>
                      <span>-{formatPrice(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-bold">
                    <span>الإجمالي</span>
                    <span className="text-accent">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                <Separator />

                {/* Update Status */}
                <div className="space-y-3">
                  <h3 className="font-semibold">تحديث حالة الطلب</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={selectedOrder.status === 'pending' ? 'default' : 'outline'}
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}
                      className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200"
                    >
                      <Clock className="h-4 w-4 ml-1" />
                      قيد الانتظار
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedOrder.status === 'confirmed' ? 'default' : 'outline'}
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmed')}
                      className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200"
                    >
                      <CheckCircle className="h-4 w-4 ml-1" />
                      تم التأكيد
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedOrder.status === 'delivered' ? 'default' : 'outline'}
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                      className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200"
                    >
                      <Truck className="h-4 w-4 ml-1" />
                      تم التوصيل
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedOrder.status === 'cancelled' ? 'default' : 'outline'}
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                      className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                    >
                      <XCircle className="h-4 w-4 ml-1" />
                      إلغاء الطلب
                    </Button>
                  </div>
                </div>

                {/* Contact Button */}
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleContactCustomer(selectedOrder)}
                >
                  <MessageCircle className="h-5 w-5 ml-2" />
                  تواصل مع العميل عبر واتساب
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
