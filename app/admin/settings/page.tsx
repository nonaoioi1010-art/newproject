'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Save, 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  Settings2, 
  Palette, 
  Image as ImageIcon,
  MessageCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Store,
  Phone,
  ArrowRight,
  Flame,
  Timer,
  AlertCircle,
  Type,
  MousePointer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { useStore, formatPrice } from '@/lib/store'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const { siteSettings, updateSiteSettings } = useStore()
  const [localSettings, setLocalSettings] = useState(siteSettings)
  const [expandedSlide, setExpandedSlide] = useState<number | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const slideInputRef = useRef<HTMLInputElement>(null)
  const dealImageInputRef = useRef<HTMLInputElement>(null)
  const [uploadingSlideIndex, setUploadingSlideIndex] = useState<number | null>(null)

  const handleSave = () => {
    updateSiteSettings(localSettings)
    toast.success('تم حفظ الإعدادات بنجاح')
  }

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('الملف ليس صورة')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setLocalSettings(prev => ({ ...prev, logoUrl: dataUrl }))
    }
    reader.readAsDataURL(file)

    if (logoInputRef.current) {
      logoInputRef.current.value = ''
    }
  }, [])

  const handleSlideImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('الملف ليس صورة')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      const newSlides = [...localSettings.heroSlides]
      newSlides[index] = { ...newSlides[index], image: dataUrl }
      setLocalSettings(prev => ({ ...prev, heroSlides: newSlides }))
    }
    reader.readAsDataURL(file)

    if (slideInputRef.current) {
      slideInputRef.current.value = ''
    }
    setUploadingSlideIndex(null)
  }, [localSettings.heroSlides])

  const handleDealImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('الملف ليس صورة')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setLocalSettings(prev => ({
        ...prev,
        dealOfDay: { ...prev.dealOfDay, productImage: dataUrl }
      }))
    }
    reader.readAsDataURL(file)

    if (dealImageInputRef.current) {
      dealImageInputRef.current.value = ''
    }
  }, [])

  const updateSlide = (index: number, field: string, value: string) => {
    const newSlides = [...localSettings.heroSlides]
    newSlides[index] = { ...newSlides[index], [field]: value }
    setLocalSettings(prev => ({ ...prev, heroSlides: newSlides }))
  }

  const addSlide = () => {
    const newSlide = {
      id: Date.now(),
      title: 'عنوان جديد',
      subtitle: 'عنوان فرعي',
      description: 'وصف الشريحة',
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&h=600&fit=crop',
      cta: 'تسوق الآن',
    }
    setLocalSettings(prev => ({
      ...prev,
      heroSlides: [...prev.heroSlides, newSlide]
    }))
    setExpandedSlide(localSettings.heroSlides.length)
  }

  const removeSlide = (index: number) => {
    if (localSettings.heroSlides.length <= 1) {
      toast.error('يجب أن تبقى شريحة واحدة على الأقل')
      return
    }
    const newSlides = localSettings.heroSlides.filter((_, i) => i !== index)
    setLocalSettings(prev => ({ ...prev, heroSlides: newSlides }))
    setExpandedSlide(null)
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">إعدادات الموقع</h1>
          <p className="text-muted-foreground">تخصيص مظهر وإعدادات المتجر</p>
        </div>
        <Button onClick={handleSave} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Save className="h-4 w-4 ml-2" />
          حفظ التغييرات
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="general" className="gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">عام</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">المظهر</span>
          </TabsTrigger>
          <TabsTrigger value="hero" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline">السلايدر</span>
          </TabsTrigger>
          <TabsTrigger value="deal" className="gap-2">
            <Flame className="h-4 w-4" />
            <span className="hidden sm:inline">العرض الحصري</span>
          </TabsTrigger>
          <TabsTrigger value="buttons" className="gap-2">
            <MousePointer className="h-4 w-4" />
            <span className="hidden sm:inline">الأزرار</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">التواصل</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                الإعدادات العامة
              </CardTitle>
              <CardDescription>معلومات الموقع الأساسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">اسم الموقع</Label>
                  <Input
                    id="siteName"
                    value={localSettings.siteName}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, siteName: e.target.value }))}
                    placeholder="جملة العم"
                  />
                </div>
                <div className="space-y-2">
                  <Label>شعار الموقع (بجانب الاسم)</Label>
                  <div className="flex items-center gap-4">
                    {localSettings.logoUrl ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border bg-secondary">
                        <Image
                          src={localSettings.logoUrl}
                          alt="Logo"
                          fill
                          className="object-contain"
                        />
                        <button
                          onClick={() => setLocalSettings(prev => ({ ...prev, logoUrl: '' }))}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-6 w-6" />
                      </div>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => logoInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 ml-2" />
                      رفع شعار
                    </Button>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml,image/webp"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg text-sm text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      متطلبات الشعار:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mr-4">
                      <li>المقاس المثالي: <strong>64x64 بكسل</strong> أو <strong>128x128 بكسل</strong></li>
                      <li>الحد الأقصى: <strong>256x256 بكسل</strong></li>
                      <li>الصيغ المدعومة: <strong>PNG, JPG, SVG, WebP</strong></li>
                      <li>يُفضل PNG أو SVG للخلفية الشفافة</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">وصف الموقع</Label>
                <Textarea
                  id="siteDescription"
                  value={localSettings.siteDescription}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                  placeholder="وصف مختصر للموقع يظهر في محركات البحث"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  هذا الوصف يظهر في نتائج محركات البحث
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                إعدادات المظهر
              </CardTitle>
              <CardDescription>تخصيص ألوان ومظهر الموقع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>اللون الرئيسي (Accent)</Label>
                <div className="flex flex-wrap items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl border-2 border-border cursor-pointer shadow-sm"
                    style={{ backgroundColor: localSettings.accentColor }}
                    onClick={() => document.getElementById('colorPicker')?.click()}
                  />
                  <Input
                    id="colorPicker"
                    type="color"
                    value={localSettings.accentColor}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-14 h-14 p-1 cursor-pointer rounded-xl"
                  />
                  <Input
                    value={localSettings.accentColor}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                    placeholder="#ff8c00"
                    className="w-32"
                    dir="ltr"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  هذا اللون يُستخدم للأزرار والروابط والعناصر البارزة في الموقع
                </p>
              </div>

              <div className="space-y-3">
                <Label>ألوان سريعة</Label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {[
                    { color: '#ff8c00', name: 'برتقالي' },
                    { color: '#10b981', name: 'أخضر' },
                    { color: '#3b82f6', name: 'أزرق' },
                    { color: '#8b5cf6', name: 'بنفسجي' },
                    { color: '#ef4444', name: 'أحمر' },
                    { color: '#f59e0b', name: 'ذهبي' },
                  ].map(({ color, name }) => (
                    <button
                      key={color}
                      onClick={() => setLocalSettings(prev => ({ ...prev, accentColor: color }))}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                        localSettings.accentColor === color 
                          ? 'border-foreground shadow-lg' 
                          : 'border-transparent bg-secondary/50'
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-lg shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs text-muted-foreground">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Slides Settings */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                شرائح الصفحة الرئيسية
              </CardTitle>
              <CardDescription>إدارة صور وعناوين السلايدر في الصفحة الرئيسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {localSettings.heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="border border-border rounded-xl overflow-hidden bg-card"
                >
                  <button
                    onClick={() => setExpandedSlide(expandedSlide === index ? null : index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <div className="relative w-20 h-12 rounded-lg overflow-hidden border border-border">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{slide.title}</p>
                        <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                      </div>
                    </div>
                    {expandedSlide === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedSlide === index && (
                    <div className="p-4 pt-0 space-y-4 border-t border-border bg-secondary/30">
                      {/* Slide Image */}
                      <div className="space-y-2">
                        <Label>صورة الشريحة</Label>
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          <div className="relative w-full sm:w-48 h-28 rounded-lg overflow-hidden border border-border">
                            <Image
                              src={slide.image}
                              alt={slide.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setUploadingSlideIndex(index)
                                slideInputRef.current?.click()
                              }}
                            >
                              <Upload className="h-4 w-4 ml-2" />
                              رفع صورة جديدة
                            </Button>
                            <Input
                              value={slide.image}
                              onChange={(e) => updateSlide(index, 'image', e.target.value)}
                              placeholder="أو أدخل رابط الصورة"
                              className="text-sm"
                              dir="ltr"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>العنوان الرئيسي</Label>
                          <Input
                            value={slide.title}
                            onChange={(e) => updateSlide(index, 'title', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>العنوان الفرعي</Label>
                          <Input
                            value={slide.subtitle}
                            onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>الوصف</Label>
                        <Textarea
                          value={slide.description}
                          onChange={(e) => updateSlide(index, 'description', e.target.value)}
                          rows={2}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                        <div className="space-y-2 w-full sm:w-auto">
                          <Label>نص الزر</Label>
                          <Input
                            value={slide.cta}
                            onChange={(e) => updateSlide(index, 'cta', e.target.value)}
                            className="w-full sm:w-48"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeSlide(index)}
                        >
                          <Trash2 className="h-4 w-4 ml-2" />
                          حذف الشريحة
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <input
                ref={slideInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (uploadingSlideIndex !== null) {
                    handleSlideImageUpload(e, uploadingSlideIndex)
                  }
                }}
              />

              <Button
                variant="outline"
                className="w-full border-dashed"
                onClick={addSlide}
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة شريحة جديدة
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deal of Day Settings */}
        <TabsContent value="deal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                العرض الحصري (عرض اليوم)
              </CardTitle>
              <CardDescription>إدارة العرض الحصري الذي يظهر في الصفحة الرئيسية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable/Disable Deal */}
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div className="space-y-0.5">
                  <Label className="text-base">تفعيل العرض الحصري</Label>
                  <p className="text-sm text-muted-foreground">
                    عند التفعيل، سيظهر العرض في الصفحة الرئيسية
                  </p>
                </div>
                <Switch
                  checked={localSettings.dealOfDay.isActive}
                  onCheckedChange={(checked) => setLocalSettings(prev => ({
                    ...prev,
                    dealOfDay: { ...prev.dealOfDay, isActive: checked }
                  }))}
                />
              </div>

              {/* Deal Product Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dealProductName">اسم المنتج</Label>
                  <Input
                    id="dealProductName"
                    value={localSettings.dealOfDay.productName}
                    onChange={(e) => setLocalSettings(prev => ({
                      ...prev,
                      dealOfDay: { ...prev.dealOfDay, productName: e.target.value }
                    }))}
                    placeholder="أرز بسمتي فاخر ٢٥ كيلو"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealOriginalPrice">السعر الأصلي (ر.ي)</Label>
                  <Input
                    id="dealOriginalPrice"
                    type="number"
                    value={localSettings.dealOfDay.originalPrice}
                    onChange={(e) => setLocalSettings(prev => ({
                      ...prev,
                      dealOfDay: { ...prev.dealOfDay, originalPrice: Number(e.target.value) }
                    }))}
                    placeholder="45000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dealDescription">وصف المنتج</Label>
                <Textarea
                  id="dealDescription"
                  value={localSettings.dealOfDay.productDescription}
                  onChange={(e) => setLocalSettings(prev => ({
                    ...prev,
                    dealOfDay: { ...prev.dealOfDay, productDescription: e.target.value }
                  }))}
                  placeholder="أرز بسمتي هندي فاخر طويل الحبة..."
                  rows={2}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dealDiscount">نسبة الخصم (%)</Label>
                  <Input
                    id="dealDiscount"
                    type="number"
                    min="1"
                    max="99"
                    value={localSettings.dealOfDay.discount}
                    onChange={(e) => setLocalSettings(prev => ({
                      ...prev,
                      dealOfDay: { ...prev.dealOfDay, discount: Number(e.target.value) }
                    }))}
                    placeholder="20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealEndsAt">تاريخ انتهاء العرض</Label>
                  <Input
                    id="dealEndsAt"
                    type="datetime-local"
                    value={localSettings.dealOfDay.endsAt ? new Date(localSettings.dealOfDay.endsAt).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setLocalSettings(prev => ({
                      ...prev,
                      dealOfDay: { ...prev.dealOfDay, endsAt: new Date(e.target.value).toISOString() }
                    }))}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Deal Image */}
              <div className="space-y-2">
                <Label>صورة المنتج</Label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div className="relative w-full sm:w-48 h-32 rounded-lg overflow-hidden border border-border">
                    {localSettings.dealOfDay.productImage ? (
                      <Image
                        src={localSettings.dealOfDay.productImage}
                        alt="Deal Product"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-secondary text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dealImageInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 ml-2" />
                      رفع صورة جديدة
                    </Button>
                    <Input
                      value={localSettings.dealOfDay.productImage}
                      onChange={(e) => setLocalSettings(prev => ({
                        ...prev,
                        dealOfDay: { ...prev.dealOfDay, productImage: e.target.value }
                      }))}
                      placeholder="أو أدخل رابط الصورة"
                      className="text-sm"
                      dir="ltr"
                    />
                  </div>
                </div>
                <input
                  ref={dealImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleDealImageUpload}
                />
              </div>

              {/* Preview */}
              <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
                <div className="flex items-center gap-3 mb-3">
                  <Timer className="h-5 w-5 text-accent" />
                  <p className="font-medium">معاينة العرض الحصري</p>
                </div>
                <div className="bg-card rounded-lg p-4 space-y-2">
                  <p className="font-bold text-lg">{localSettings.dealOfDay.productName || 'اسم المنتج'}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {localSettings.dealOfDay.productDescription || 'وصف المنتج...'}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-accent">
                      {formatPrice(localSettings.dealOfDay.originalPrice * (1 - localSettings.dealOfDay.discount / 100))}
                    </span>
                    <span className="text-muted-foreground line-through">
                      {formatPrice(localSettings.dealOfDay.originalPrice)}
                    </span>
                    <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-bold">
                      -{localSettings.dealOfDay.discount}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Buttons Settings */}
        <TabsContent value="buttons">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointer className="h-5 w-5" />
                إعدادات الأزرار
              </CardTitle>
              <CardDescription>تخصيص نصوص الأزرار الرئيسية في الموقع</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primaryButtonText">نص زر الإضافة للسلة</Label>
                  <Input
                    id="primaryButtonText"
                    value={localSettings.primaryButtonText}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, primaryButtonText: e.target.value }))}
                    placeholder="أضف للسلة"
                  />
                  <p className="text-xs text-muted-foreground">
                    هذا النص يظهر على زر إضافة المنتج للسلة
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryButtonText">نص زر التسوق</Label>
                  <Input
                    id="secondaryButtonText"
                    value={localSettings.secondaryButtonText}
                    onChange={(e) => setLocalSettings(prev => ({ ...prev, secondaryButtonText: e.target.value }))}
                    placeholder="تسوق الآن"
                  />
                  <p className="text-xs text-muted-foreground">
                    هذا النص يظهر على أزرار التسوق في السلايدر والصفحة الرئيسية
                  </p>
                </div>
              </div>

              {/* Preview Buttons */}
              <div className="space-y-3">
                <Label>معاينة الأزرار</Label>
                <div className="flex flex-wrap gap-4 p-4 bg-secondary/50 rounded-xl">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    {localSettings.primaryButtonText || 'أضف للسلة'}
                  </Button>
                  <Button variant="outline">
                    {localSettings.secondaryButtonText || 'تسوق الآن'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                إعدادات التواصل
              </CardTitle>
              <CardDescription>معلومات التواصل والدعم الفني</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="whatsapp">رقم الواتساب</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-lg">+</span>
                  <Input
                    id="whatsapp"
                    value={localSettings.whatsappNumber}
                    onChange={(e) => setLocalSettings(prev => ({ 
                      ...prev, 
                      whatsappNumber: e.target.value.replace(/\D/g, '') 
                    }))}
                    placeholder="967772652212"
                    dir="ltr"
                    className="flex-1 text-lg"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  أدخل الرقم بالصيغة الدولية بدون علامة + (مثال: 967772652212 لليمن)
                </p>
              </div>

              <div className="p-4 bg-[#25D366]/10 rounded-xl border border-[#25D366]/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">معاينة زر الواتساب</p>
                    <p className="text-sm text-muted-foreground">هذا الزر يظهر في جميع صفحات الموقع</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  عند الضغط على زر الواتساب، سيتم فتح محادثة مع الرقم: +{localSettings.whatsappNumber || '967772652212'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
