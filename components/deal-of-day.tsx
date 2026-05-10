'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Timer, MessageCircle, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, useStore } from '@/lib/store'
import { toast } from 'sonner'

export function DealOfDay() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const { siteSettings } = useStore()
  
  // Get deal settings from store
  const dealOfDay = siteSettings?.dealOfDay

  useEffect(() => {
    if (!dealOfDay?.isActive || !dealOfDay?.endsAt) return

    const calculateTimeLeft = () => {
      const endTime = new Date(dealOfDay.endsAt).getTime()
      const now = Date.now()
      const difference = endTime - now

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [dealOfDay?.isActive, dealOfDay?.endsAt])

  // Don't render if deal is not active
  if (!dealOfDay?.isActive) {
    return null
  }

  const discountedPrice = dealOfDay.originalPrice * (1 - dealOfDay.discount / 100)

  const handleOrderViaWhatsApp = () => {
    const whatsappNumber = siteSettings?.whatsappNumber || '967772652212'
    const message = `مرحباً، أريد طلب عرض اليوم:

*${dealOfDay.productName}*
السعر بعد الخصم: ${formatPrice(discountedPrice)}
(السعر الأصلي: ${formatPrice(dealOfDay.originalPrice)})

شكراً لكم!`
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    toast.success('جاري فتح واتساب...')
  }

  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Flame className="h-6 w-6 text-accent" />
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">
            عرض اليوم
          </h2>
          <Flame className="h-6 w-6 text-accent" />
        </div>

        <div className="max-w-4xl mx-auto bg-card rounded-2xl overflow-hidden shadow-xl">
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative h-64 md:h-auto">
              <Image
                src={dealOfDay.productImage || 'https://via.placeholder.com/400'}
                alt={dealOfDay.productName}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4 px-4 py-2 bg-destructive text-destructive-foreground rounded-full text-lg font-bold">
                -{dealOfDay.discount}%
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-card-foreground mb-2">
                {dealOfDay.productName}
              </h3>
              <p className="text-muted-foreground mb-4">
                {dealOfDay.productDescription}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-accent">
                  {formatPrice(discountedPrice)}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(dealOfDay.originalPrice)}
                </span>
              </div>

              {/* Timer */}
              <div className="flex items-center gap-2 mb-6">
                <Timer className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">ينتهي العرض خلال:</span>
                <div className="flex gap-2">
                  <div className="flex flex-col items-center px-3 py-2 bg-secondary rounded-lg">
                    <span className="text-xl font-bold text-secondary-foreground">
                      {timeLeft.hours.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs text-muted-foreground">ساعة</span>
                  </div>
                  <span className="text-xl font-bold text-card-foreground self-center">:</span>
                  <div className="flex flex-col items-center px-3 py-2 bg-secondary rounded-lg">
                    <span className="text-xl font-bold text-secondary-foreground">
                      {timeLeft.minutes.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs text-muted-foreground">دقيقة</span>
                  </div>
                  <span className="text-xl font-bold text-card-foreground self-center">:</span>
                  <div className="flex flex-col items-center px-3 py-2 bg-secondary rounded-lg">
                    <span className="text-xl font-bold text-secondary-foreground">
                      {timeLeft.seconds.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs text-muted-foreground">ثانية</span>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-green-600 text-white hover:bg-green-700"
                onClick={handleOrderViaWhatsApp}
              >
                <MessageCircle className="h-5 w-5 ml-2" />
                اطلب عبر واتساب
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
