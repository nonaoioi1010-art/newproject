'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Plus, Minus, Trash2, MessageCircle, Loader2, CheckCircle } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSlideOver } from '@/components/cart-slide-over'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStore, formatPrice } from '@/lib/store'
import { toast } from 'sonner'

interface CustomerInfo {
  fullName: string
  phone: string
  city: string
  neighborhood: string
  street: string
  buildingNumber: string
  landmark: string
  notes: string
  latitude: number | null
  longitude: number | null
}

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart, siteSettings } = useStore()
  
  const [step, setStep] = useState<'cart' | 'info'>('cart')
  const [isLocating, setIsLocating] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    city: '',
    neighborhood: '',
    street: '',
    buildingNumber: '',
    landmark: '',
    notes: '',
    latitude: null,
    longitude: null,
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0 && step === 'cart') {
      router.push('/')
    }
  }, [cart.length, router, step])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCustomerInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleGetLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('المتصفح لا يدعم تحديد الموقع')
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCustomerInfo(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }))
        setIsLocating(false)
        toast.success('تم تحديد موقعك بنجاح')
      },
      (error) => {
        setIsLocating(false)
        if (error.code === error.PERMISSION_DENIED) {
          toast.error('يرجى السماح بالوصول للموقع')
        } else {
          toast.error('فشل في تحديد الموقع')
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  const handleContinueToInfo = () => {
    if (cart.length === 0) {
      toast.error('السلة فارغة')
      return
    }
    setStep('info')
  }

  const handleSubmitOrder = () => {
    // Validate required fields
    if (!customerInfo.fullName.trim()) {
      toast.error('يرجى إدخال الاسم الكامل')
      return
    }
    if (!customerInfo.phone.trim()) {
      toast.error('يرجى إدخال رقم الهاتف')
      return
    }
    if (!customerInfo.city.trim()) {
      toast.error('يرجى إدخال المدينة')
      return
    }

    // Build WhatsApp message
    const whatsappNumber = siteSettings?.whatsappNumber || '967772652212'
    
    let message = `*طلب جديد*\n\n`
    message += `*بيانات العميل:*\n`
    message += `الاسم: ${customerInfo.fullName}\n`
    message += `الهاتف: ${customerInfo.phone}\n`
    message += `المدينة: ${customerInfo.city}\n`
    
    if (customerInfo.neighborhood) {
      message += `الحي: ${customerInfo.neighborhood}\n`
    }
    if (customerInfo.street) {
      message += `الشارع: ${customerInfo.street}\n`
    }
    if (customerInfo.buildingNumber) {
      message += `رقم المبنى: ${customerInfo.buildingNumber}\n`
    }
    if (customerInfo.landmark) {
      message += `علامة مميزة: ${customerInfo.landmark}\n`
    }
    if (customerInfo.notes) {
      message += `ملاحظات: ${customerInfo.notes}\n`
    }
    
    // Add location if available
    if (customerInfo.latitude && customerInfo.longitude) {
      message += `\n*الموقع على الخريطة:*\n`
      message += `https://www.google.com/maps?q=${customerInfo.latitude},${customerInfo.longitude}\n`
    }
    
    message += `\n*المنتجات المطلوبة:*\n`
    message += `━━━━━━━━━━━━━━\n`
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.product.nameAr}\n`
      message += `   الكمية: ${item.quantity} ${item.product.unitAr}\n`
      message += `   السعر: ${formatPrice(item.product.wholesalePrice * item.quantity)}\n\n`
    })
    
    message += `━━━━━━━━━━━━━━\n`
    message += `*الإجمالي: ${formatPrice(getCartTotal())}*\n`
    message += `\nشكراً لكم!`
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    
    // Clear cart and redirect to WhatsApp
    clearCart()
    window.open(whatsappUrl, '_blank')
    
    toast.success('تم إرسال طلبك بنجاح!')
    router.push('/')
  }

  if (cart.length === 0 && step === 'cart') {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-accent">الرئيسية</Link>
            <span>/</span>
            <span className="text-foreground font-medium">
              {step === 'cart' ? 'سلة التسوق' : 'بيانات التوصيل'}
            </span>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step === 'cart' ? 'text-accent' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === 'cart' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                {step === 'info' ? <CheckCircle className="h-5 w-5" /> : '1'}
              </div>
              <span className="hidden sm:inline font-medium">سلة التسوق</span>
            </div>
            <div className="w-16 h-0.5 bg-muted" />
            <div className={`flex items-center gap-2 ${step === 'info' ? 'text-accent' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step === 'info' ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                2
              </div>
              <span className="hidden sm:inline font-medium">بيانات التوصيل</span>
            </div>
          </div>

          {step === 'cart' ? (
            /* Cart Step */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <h1 className="text-2xl font-bold mb-6">سلة التسوق</h1>
                
                {cart.map((item) => (
                  <Card key={item.product.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                          <Image
                            src={item.product.image}
                            alt={item.product.nameAr}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {item.product.nameAr}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.product.categoryAr}
                          </p>
                          <p className="text-accent font-bold">
                            {formatPrice(item.product.wholesalePrice)}
                          </p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>ملخص الطلب</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.product.nameAr} × {item.quantity}
                          </span>
                          <span>{formatPrice(item.product.wholesalePrice * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-bold">
                        <span>الإجمالي</span>
                        <span className="text-accent">{formatPrice(getCartTotal())}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <Link href="/products">
                        <Button variant="outline" className="w-full">
                          تسوق المزيد
                        </Button>
                      </Link>
                      <Button 
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                        onClick={handleContinueToInfo}
                      >
                        متابعة
                        <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Customer Info Step */
            <div className="max-w-2xl mx-auto">
              <Button
                variant="ghost"
                className="mb-6"
                onClick={() => setStep('cart')}
              >
                <ArrowRight className="h-4 w-4 ml-2" />
                العودة للسلة
              </Button>

              <Card>
                <CardHeader>
                  <CardTitle>بيانات التوصيل</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Info */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">الاسم الكامل *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={customerInfo.fullName}
                        onChange={handleInputChange}
                        placeholder="أدخل اسمك الكامل"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">رقم الهاتف *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        placeholder="967xxxxxxxxx"
                        required
                        dir="ltr"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">المدينة *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={customerInfo.city}
                        onChange={handleInputChange}
                        placeholder="مثال: صنعاء"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">الحي</Label>
                      <Input
                        id="neighborhood"
                        name="neighborhood"
                        value={customerInfo.neighborhood}
                        onChange={handleInputChange}
                        placeholder="مثال: حي الجامعة"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="street">الشارع</Label>
                      <Input
                        id="street"
                        name="street"
                        value={customerInfo.street}
                        onChange={handleInputChange}
                        placeholder="اسم الشارع"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buildingNumber">رقم المبنى</Label>
                      <Input
                        id="buildingNumber"
                        name="buildingNumber"
                        value={customerInfo.buildingNumber}
                        onChange={handleInputChange}
                        placeholder="رقم المبنى أو الشقة"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="landmark">علامة مميزة</Label>
                    <Input
                      id="landmark"
                      name="landmark"
                      value={customerInfo.landmark}
                      onChange={handleInputChange}
                      placeholder="مثال: بجوار مسجد..."
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-3">
                    <Label>تحديد الموقع على الخريطة</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGetLocation}
                      disabled={isLocating}
                    >
                      {isLocating ? (
                        <>
                          <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                          جاري تحديد الموقع...
                        </>
                      ) : customerInfo.latitude ? (
                        <>
                          <CheckCircle className="h-4 w-4 ml-2 text-green-500" />
                          تم تحديد الموقع
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4 ml-2" />
                          تحديد موقعي الحالي
                        </>
                      )}
                    </Button>
                    {customerInfo.latitude && customerInfo.longitude && (
                      <div className="rounded-lg overflow-hidden border">
                        <iframe
                          src={`https://www.google.com/maps?q=${customerInfo.latitude},${customerInfo.longitude}&z=15&output=embed`}
                          width="100%"
                          height="200"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">ملاحظات إضافية</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={customerInfo.notes}
                      onChange={handleInputChange}
                      placeholder="أي ملاحظات إضافية للتوصيل..."
                      rows={3}
                    />
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-6 space-y-3">
                    <h3 className="font-semibold">ملخص الطلب</h3>
                    <div className="space-y-2 text-sm">
                      {cart.map((item) => (
                        <div key={item.product.id} className="flex justify-between">
                          <span className="text-muted-foreground">
                            {item.product.nameAr} × {item.quantity}
                          </span>
                          <span>{formatPrice(item.product.wholesalePrice * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t">
                      <span>الإجمالي</span>
                      <span className="text-accent">{formatPrice(getCartTotal())}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    className="w-full bg-green-600 text-white hover:bg-green-700 h-12 text-lg"
                    onClick={handleSubmitOrder}
                  >
                    <MessageCircle className="h-5 w-5 ml-2" />
                    تأكيد الطلب عبر واتساب
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CartSlideOver />
    </div>
  )
}
