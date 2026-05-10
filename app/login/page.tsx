'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Package, Mail, ArrowRight, Loader2, Shield, User, Phone, MapPin, SkipForward } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useStore } from '@/lib/store'
import { toast } from 'sonner'

type Step = 'email' | 'otp' | 'profile'

// Social icons as SVG components
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const FacebookIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const InstagramIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <defs>
      <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFDC80"/>
        <stop offset="25%" stopColor="#FCAF45"/>
        <stop offset="50%" stopColor="#F77737"/>
        <stop offset="75%" stopColor="#F56040"/>
        <stop offset="100%" stopColor="#C13584"/>
      </linearGradient>
    </defs>
    <path fill="url(#instagram-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const TikTokIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const { setUser, siteSettings } = useStore()
  
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<Step>('email')
  const [isLoading, setIsLoading] = useState(false)
  
  // Profile data
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: ''
  })

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('الرجاء إدخال البريد الإلكتروني')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('الرجاء إدخال بريد إلكتروني صحيح')
      return
    }

    setIsLoading(true)
    
    // Mock sending OTP email
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setStep('otp')
    toast.success('تم إرسال رمز التحقق إلى بريدك الإلكتروني')
    setIsLoading(false)
  }

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('الرجاء إدخال رمز التحقق كاملاً')
      return
    }

    setIsLoading(true)
    
    // Mock OTP verification (accept any 6 digits)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Check if admin email
    if (email === 'admin@jomlah.com') {
      setUser({
        id: 'admin-1',
        name: 'مدير النظام',
        email,
        phone: '',
        isAdmin: true,
      })
      toast.success('تم تسجيل الدخول كمدير')
      router.push('/admin')
    } else {
      // For regular users, show profile completion step
      setStep('profile')
      toast.success('تم التحقق بنجاح')
    }
    
    setIsLoading(false)
  }

  const handleCompleteProfile = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setUser({
      id: 'user-' + Date.now(),
      name: profileData.name || 'عميل',
      email,
      phone: profileData.phone,
      isAdmin: false,
    })
    
    toast.success('تم تسجيل الدخول بنجاح')
    router.push('/')
    setIsLoading(false)
  }

  const handleSkipProfile = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    setUser({
      id: 'user-' + Date.now(),
      name: 'عميل',
      email,
      phone: '',
      isAdmin: false,
    })
    
    toast.success(`مرحباً بك في ${siteSettings.siteName}`)
    router.push('/')
    setIsLoading(false)
  }

  // Social login handlers
  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'instagram' | 'tiktok') => {
    setIsLoading(true)
    
    // Mock social login - in real app, this would use OAuth
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const mockUserData: Record<string, { name: string; email: string }> = {
      google: { name: 'مستخدم Google', email: 'user@gmail.com' },
      facebook: { name: 'مستخدم Facebook', email: 'user@facebook.com' },
      instagram: { name: 'مستخدم Instagram', email: 'user@instagram.com' },
      tiktok: { name: 'مستخدم TikTok', email: 'user@tiktok.com' },
    }

    const userData = mockUserData[provider]
    
    // Set profile data from social account
    setProfileData({
      name: userData.name,
      phone: '',
      address: ''
    })
    setEmail(userData.email)
    
    // Go to profile step to confirm/edit data
    setStep('profile')
    toast.success(`تم جلب بياناتك من ${provider}، يمكنك تأكيدها أو تعديلها`)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-8 w-8 text-accent" />
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight">{siteSettings.siteName}</span>
              <span className="text-xs text-primary-foreground/70">للتسوق</span>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة للرئيسية
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
              {step === 'profile' ? (
                <User className="h-8 w-8 text-accent" />
              ) : (
                <Shield className="h-8 w-8 text-accent" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {step === 'email' && 'تسجيل الدخول'}
              {step === 'otp' && 'التحقق من البريد'}
              {step === 'profile' && 'أكمل بياناتك'}
            </CardTitle>
            <CardDescription>
              {step === 'email' && 'أدخل بريدك الإلكتروني أو سجل عبر حساباتك'}
              {step === 'otp' && 'أدخل رمز التحقق المرسل إلى بريدك'}
              {step === 'profile' && 'تأكد من بياناتك أو عدلها ثم تابع'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Email Input */}
            {step === 'email' && (
              <div className="space-y-6">
                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <p className="text-sm text-center text-muted-foreground">تسجيل الدخول السريع</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-12"
                      onClick={() => handleSocialLogin('google')}
                      disabled={isLoading}
                    >
                      <GoogleIcon />
                      <span className="mr-2">Google</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12"
                      onClick={() => handleSocialLogin('facebook')}
                      disabled={isLoading}
                    >
                      <FacebookIcon />
                      <span className="mr-2">Facebook</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12"
                      onClick={() => handleSocialLogin('instagram')}
                      disabled={isLoading}
                    >
                      <InstagramIcon />
                      <span className="mr-2">Instagram</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-12"
                      onClick={() => handleSocialLogin('tiktok')}
                      disabled={isLoading}
                    >
                      <TikTokIcon />
                      <span className="mr-2">TikTok</span>
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground">أو بالبريد الإلكتروني</span>
                  </div>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        dir="ltr"
                        className="text-left pr-10"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      سنرسل لك رمز تحقق على هذا البريد
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    disabled={isLoading || !email}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      'إرسال رمز التحقق'
                    )}
                  </Button>
                </form>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 'otp' && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    تم إرسال رمز التحقق إلى
                  </p>
                  <p className="font-medium" dir="ltr">{email}</p>
                </div>
                
                <div className="flex justify-center">
                  <InputOTP
                    value={otp}
                    onChange={setOtp}
                    maxLength={6}
                  >
                    <InputOTPGroup className="gap-2" dir="ltr">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    'تأكيد'
                  )}
                </Button>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    className="text-accent hover:underline"
                    onClick={() => {
                      setStep('email')
                      setOtp('')
                    }}
                  >
                    تغيير البريد الإلكتروني
                  </button>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={handleSendOTP}
                    disabled={isLoading}
                  >
                    إعادة إرسال الرمز
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Profile Completion */}
            {step === 'profile' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="الاسم الكامل"
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم التواصل (اختياري)</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+967 XXX XXX XXX"
                      dir="ltr"
                      className="text-left pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">العنوان (اختياري)</Label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      placeholder="المدينة، الحي، الشارع"
                      className="pr-10"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleCompleteProfile}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      'حفظ والمتابعة'
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSkipProfile}
                    disabled={isLoading}
                  >
                    <SkipForward className="h-4 w-4 ml-1" />
                    تخطي
                  </Button>
                </div>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  يمكنك إضافة بياناتك لاحقاً من صفحة حسابك
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
