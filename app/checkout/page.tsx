'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Tag, MapPin, Truck, MessageCircle, Check, X, Loader2, Navigation, Home, Building2 } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSlideOver } from '@/components/cart-slide-over'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice, useStore } from '@/lib/store'
import { discountCodes } from '@/lib/data'
import { toast } from 'sonner'

const WHATSAPP_NUMBER = '967772652212' // رقم واتساب جملة العم

// قائمة المدن والأحياء في اليمن
const yemenCities = [
  { id: 'sanaa', name: 'صنعاء', neighborhoods: ['حي التحرير', 'حي الزبيري', 'حي السنينة', 'حي بير العزب', 'حي شعوب', 'حي الحصبة', 'حي نقم', 'حي الجراف', 'حي المطار', 'حي الثورة'] },
  { id: 'aden', name: 'عدن', neighborhoods: ['كريتر', 'المعلا', 'التواهي', 'خور مكسر', 'الشيخ عثمان', 'المنصورة', 'دار سعد', 'البريقة'] },
  { id: 'taiz', name: 'تعز', neighborhoods: ['حي المطار', 'حي القاهرة', 'حي الحوبان', 'حي المظفر', 'حي صالة', 'حي القصر'] },
  { id: 'hodeidah', name: 'الحديدة', neighborhoods: ['حي الثورة', 'حي الصالح', 'حي الميناء', 'حي 22 مايو', 'حي الزعفران'] },
  { id: 'ibb', name: 'إب', neighborhoods: ['حي السبعين', 'حي المظفر', 'حي الشهيد', 'حي الثورة', 'حي الجمهورية'] },
  { id: 'mukalla', name: 'المكلا', neighborhoods: ['حي الديس', 'حي فوة', 'حي الشرج', 'حي خلف', 'حي المسيلة'] },
]

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, getCartTotal, clearCart, addOrder, user } = useStore()
  
  const [step, setStep] = useState<'review' | 'delivery'>('review')
  
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percent: number } | null>(null)
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)
  
  const [deliveryDetails, setDeliveryDetails] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    city: '',
    neighborhood: '',
    street: '',
    buildingNumber: '',
    landmark: '',
    notes: '',
  })
  
  const [mapCoords, setMapCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableNeighborhoods, setAvailableNeighborhoods] = useState<string[]>([])

  const subtotal = getCartTotal()
  const discountAmount = appliedDiscount ? (subtotal * appliedDiscount.percent) / 100 : 0
  const total = subtotal - discountAmount

  // تحديث الأحياء عند تغيير المدينة
  useEffect(() => {
    const city = yemenCities.find(c => c.id === deliveryDetails.city)
    if (city) {
      setAvailableNeighborhoods(city.neighborhoods)
      setDeliveryDetails(prev => ({ ...prev, neighborhood: '' }))
    } else {
      setAvailableNeighborhoods([])
    }
  }, [deliveryDetails.city])

  const handleApplyDiscount = () => {
    setIsApplyingDiscount(true)
    
    setTimeout(() => {
      const discount = discountCodes[discountCode.toUpperCase()]
      if (discount) {
        setAppliedDiscount({ code: discountCode.toUpperCase(), percent: discount })
        toast.success(`تم تطبيق الخصم ${discount}% بنجاح`)
      } else {
        toast.error('كود الخصم غير صالح')
      }
      setIsApplyingDiscount(false)
    }, 500)
  }

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountCode('')
    toast.info('تم إزالة كود الخصم')
  }

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('المتصفح لا يدعم تحديد الموقع')
      return
    }

    setIsLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        toast.success('تم تحديد موقعك بنجاح')
        setIsLoadingLocation(false)
      },
      () => {
        toast.error('فشل في تحديد الموقع - تأكد من تفعيل GPS')
        setIsLoadingLocation(false)
      },
      { enableHighAccuracy: true }
    )
  }

  const handleProceedToDelivery = () => {
    if (cart.length === 0) {
      toast.error('السلة فارغة')
      return
    }
    setStep('delivery')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmitOrder = () => {
    if (!deliveryDetails.fullName || !deliveryDetails.phone || !deliveryDetails.city || !deliveryDetails.neighborhood) {
      toast.error('الرجاء إكمال جميع بيانات التوصيل المطلوبة')
      return
    }

    if (cart.length === 0) {
      toast.error('السلة فارغة')
      return
    }

    setIsSubmitting(true)

    // إنشاء رقم الطلب
    const orderId = `JO-${Date.now().toString(36).toUpperCase()}`

    // تجميع العنوان الكامل
    const cityName = yemenCities.find(c => c.id === deliveryDetails.city)?.name || ''
    const fullAddress = `${cityName} - ${deliveryDetails.neighborhood}${deliveryDetails.street ? ` - ${deliveryDetails.street}` : ''}${deliveryDetails.buildingNumber ? ` - مبنى ${deliveryDetails.buildingNumber}` : ''}`

    // إنشاء الطلب
    const order = {
      id: orderId,
      userId: user?.id || 'guest',
      items: cart,
      total,
      discount: discountAmount,
      deliveryDetails: {
        fullName: deliveryDetails.fullName,
        phone: deliveryDetails.phone,
        address: fullAddress,
        city: cityName,
        neighborhood: deliveryDetails.neighborhood,
        street: deliveryDetails.street,
        buildingNumber: deliveryDetails.buildingNumber,
        landmark: deliveryDetails.landmark,
        notes: deliveryDetails.notes,
        latitude: mapCoords?.lat,
        longitude: mapCoords?.lng,
      },
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    }

    // حفظ الطلب
    addOrder(order)

    // إنشاء رسالة الواتساب
    const itemsList = cart
      .map((item) => `• ${item.product.nameAr} × ${item.quantity} = ${formatPrice(item.product.wholesalePrice * item.quantity)}`)
      .join('\n')

    const message = `
*طلب جديد من جملة العم* 🛒

*رقم الطلب:* ${orderId}

━━━━━━━━━━━━━━━━━━
*المنتجات:*
${itemsList}
━━━━━━━━━━━━━━━━━━

*المجموع الفرعي:* ${formatPrice(subtotal)}
${appliedDiscount ? `*الخصم (${appliedDiscount.percent}%):* -${formatPrice(discountAmount)}\n` : ''}*الإجمالي:* ${formatPrice(total)}

━━━━━━━━━━━━━━━━━━
*بيانات التوصيل:*
📛 الاسم: ${deliveryDetails.fullName}
📱 الهاتف: ${deliveryDetails.phone}
🏙️ المدينة: ${cityName}
🏘️ الحي: ${deliveryDetails.neighborhood}
${deliveryDetails.street ? `🛣️ الشارع: ${deliveryDetails.street}\n` : ''}${deliveryDetails.buildingNumber ? `🏠 رقم المبنى: ${deliveryDetails.buildingNumber}\n` : ''}${deliveryDetails.landmark ? `📍 علامة مميزة: ${deliveryDetails.landmark}\n` : ''}${deliveryDetails.notes ? `📝 ملاحظات: ${deliveryDetails.notes}\n` : ''}${mapCoords ? `🗺️ الموقع على الخريطة:\nhttps://maps.google.com/?q=${mapCoords.lat},${mapCoords.lng}` : ''}
━━━━━━━━━━━━━━━━━━

شكراً لتسوقكم من جملة العم! 🙏
    `.trim()

    // مسح السلة
    clearCart()

    // فتح واتساب
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')

    toast.success('تم إرسال طلبك بنجاح!')
    router.push('/orders')
  }

  if (cart.length === 0 && step === 'review') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Truck className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold mb-4">سلتك فارغة</h1>
            <p className="text-muted-foreground mb-6">
              أضف بعض المنتجات إلى سلتك للمتابعة
            </p>
            <Link href="/products">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                تصفح المنتجات
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
        <CartSlideOver />
      </div>
    )
  }

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

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              الرئيسية
            </Link>
            <ArrowRight className="h-4 w-4 text-muted-foreground rotate-180" />
            <Link href="/products" className="text-muted-foreground hover:text-foreground">
              المنتجات
            </Link>
            <ArrowRight className="h-4 w-4 text-muted-foreground rotate-180" />
            <span className="text-foreground">إتمام الطلب</span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === 'review' ? 'text-accent' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-accent text-accent-foreground' : step === 'delivery' ? 'bg-green-500 text-white' : 'bg-muted'}`}>
                {step === 'delivery' ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className="font-medium">مراجعة السلة</span>
            </div>
            <div className="w-12 h-0.5 bg-muted" />
            <div className={`flex items-center gap-2 ${step === 'delivery' ? 'text-accent' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'delivery' ? 'bg-accent text-accent-foreground' : 'bg-muted'}`}>
                2
              </div>
              <span className="font-medium">بيانات التوصيل</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-8">
            {step === 'review' ? 'مراجعة ��لة التسوق' : 'بيانات التوصيل'}
          </h1>

          {step === 'review' ? (
            /* Step 1: Cart Review */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>منتجات السلة ({cart.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex gap-4 p-4 bg-secondary rounded-lg">
                        <div className="relative w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.nameAr}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{item.product.nameAr}</h3>
                          <p className="text-sm text-muted-foreground">{item.product.descriptionAr}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm">الكمية: {item.quantity} {item.product.unitAr}</span>
                            <span className="text-lg font-bold text-accent">
                              {formatPrice(item.product.wholesalePrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Discount Code */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="h-5 w-5 text-accent" />
                      كود الخصم
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {appliedDiscount ? (
                      <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-500" />
                          <span className="font-medium">{appliedDiscount.code}</span>
                          <span className="text-sm text-muted-foreground">
                            (-{appliedDiscount.percent}%)
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleRemoveDiscount}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          placeholder="أدخل كود الخصم"
                          className="flex-1"
                        />
                        <Button onClick={handleApplyDiscount} disabled={!discountCode || isApplyingDiscount}>
                          {isApplyingDiscount ? <Loader2 className="h-4 w-4 animate-spin" /> : 'تطبيق'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>ملخص الطلب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">عدد المن��جات</span>
                        <span>{cart.length} منتج</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">المجموع الفرعي</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      {appliedDiscount && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>الخصم ({appliedDiscount.percent}%)</span>
                          <span>-{formatPrice(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">التوصيل</span>
                        <span className="text-accent">مجاني</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-xl font-bold">
                      <span>الإجمالي</span>
                      <span className="text-accent">{formatPrice(total)}</span>
                    </div>

                    <Button
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                      size="lg"
                      onClick={handleProceedToDelivery}
                    >
                      متابعة لبيانات التوصيل
                      <ArrowRight className="h-5 w-5 mr-2 rotate-180" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Step 2: Delivery Details */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Delivery Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-accent" />
                      المعلومات الشخصية
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">الاسم الكامل *</Label>
                        <Input
                          id="fullName"
                          value={deliveryDetails.fullName}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, fullName: e.target.value })}
                          placeholder="أدخل اسمك الكامل"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">رقم الهاتف *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={deliveryDetails.phone}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, phone: e.target.value })}
                          placeholder="+967 7XX XXX XXX"
                          dir="ltr"
                          className="text-left"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Address Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="h-5 w-5 text-accent" />
                      عنوان التوصيل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">المدينة *</Label>
                        <select
                          id="city"
                          value={deliveryDetails.city}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, city: e.target.value })}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="">اختر المدينة</option>
                          {yemenCities.map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="neighborhood">الحي *</Label>
                        <select
                          id="neighborhood"
                          value={deliveryDetails.neighborhood}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, neighborhood: e.target.value })}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          disabled={!deliveryDetails.city}
                        >
                          <option value="">اختر الحي</option>
                          {availableNeighborhoods.map((neighborhood) => (
                            <option key={neighborhood} value={neighborhood}>
                              {neighborhood}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="street">الشارع</Label>
                        <Input
                          id="street"
                          value={deliveryDetails.street}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, street: e.target.value })}
                          placeholder="اسم الشارع"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="buildingNumber">رقم المبنى / المنزل</Label>
                        <Input
                          id="buildingNumber"
                          value={deliveryDetails.buildingNumber}
                          onChange={(e) => setDeliveryDetails({ ...deliveryDetails, buildingNumber: e.target.value })}
                          placeholder="مثال: 15"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="landmark">علامة مميزة قريبة</Label>
                      <Input
                        id="landmark"
                        value={deliveryDetails.landmark}
                        onChange={(e) => setDeliveryDetails({ ...deliveryDetails, landmark: e.target.value })}
                        placeholder="مثال: بجوار مسجد الرحمن، أمام صيدلية السلام"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">ملاحظات إضافية</Label>
                      <Textarea
                        id="notes"
                        value={deliveryDetails.notes}
                        onChange={(e) => setDeliveryDetails({ ...deliveryDetails, notes: e.target.value })}
                        placeholder="أي تعليمات خاصة للتوصيل..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Google Maps Location */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-accent" />
                      تحديد الموقع على الخريطة
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      حدد موقعك بدقة على الخريطة لضمان وصول الطلب بشكل أسرع
                    </p>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGetLocation}
                      disabled={isLoadingLocation}
                    >
                      {isLoadingLocation ? (
                        <>
                          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                          جاري تحديد الموقع...
                        </>
                      ) : (
                        <>
                          <Navigation className="h-4 w-4 ml-2" />
                          {mapCoords ? 'تحديث موقعي' : 'تحديد موقعي الحالي (GPS)'}
                        </>
                      )}
                    </Button>

                    {mapCoords && (
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            تم تحديد موقعك بنجاح
                          </p>
                        </div>
                        
                        {/* Google Maps Embed */}
                        <div className="rounded-lg overflow-hidden border">
                          <iframe
                            src={`https://maps.google.com/maps?q=${mapCoords.lat},${mapCoords.lng}&z=16&output=embed`}
                            width="100%"
                            height="250"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                        
                        <a
                          href={`https://maps.google.com/?q=${mapCoords.lat},${mapCoords.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent hover:underline flex items-center gap-1"
                        >
                          <MapPin className="h-4 w-4" />
                          فتح في خرائط جوجل
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Back Button */}
                <Button variant="outline" onClick={() => setStep('review')} className="w-full sm:w-auto">
                  <ArrowRight className="h-4 w-4 ml-2" />
                  العودة لمراجعة السلة
                </Button>
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>ملخص الطلب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Mini Cart Items */}
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex gap-3">
                          <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.image}
                              alt={item.product.nameAr}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.product.nameAr}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity} × {formatPrice(item.product.wholesalePrice)}
                            </p>
                          </div>
                          <span className="text-sm font-bold text-accent">
                            {formatPrice(item.product.wholesalePrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">المجموع الفرعي</span>
                        <span>{formatPrice(subtotal)}</span>
                      </div>
                      {appliedDiscount && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>الخصم ({appliedDiscount.percent}%)</span>
                          <span>-{formatPrice(discountAmount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">التوصيل</span>
                        <span className="text-accent">مجاني</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-xl font-bold">
                      <span>الإجمالي</span>
                      <span className="text-accent">{formatPrice(total)}</span>
                    </div>

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 ml-2 animate-spin" />
                          جاري إرسال الطلب...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-5 w-5 ml-2" />
                          تأكيد الطلب عبر واتساب
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      سيتم إرسال تفاصيل طلبك إلى واتساب لتأكيده
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartSlideOver />
    </div>
  )
}
