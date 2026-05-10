'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowRight, MessageCircle, Plus, Minus, ChevronLeft, ChevronRight, X, Share2, Heart } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { products } from '@/lib/data'
import { formatPrice, useStore } from '@/lib/store'
import { toast } from 'sonner'
import { ProductCard } from '@/components/product-card'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { siteSettings } = useStore()
  
  const productId = params.id as string
  const product = products.find(p => p.id === productId)
  
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  // Mock multiple images (in real app, product would have images array)
  const productImages = useMemo(() => {
    if (!product) return []
    // For now, just use the same image. In the future, product.images would be an array
    return [product.image]
  }, [product])

  // Related products from same category
  const relatedProducts = useMemo(() => {
    if (!product) return []
    return products
      .filter(p => p.category === product.category && p.id !== product.id)
      .slice(0, 4)
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
            <Button onClick={() => router.push('/products')}>
              <ArrowRight className="h-4 w-4 ml-2" />
              العودة للمنتجات
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const savings = product.retailPrice - product.wholesalePrice
  const savingsPercent = Math.round((savings / product.retailPrice) * 100)

  const handleOrderViaWhatsApp = () => {
    const whatsappNumber = siteSettings?.whatsappNumber || '967772652212'
    const message = `مرحباً، أريد طلب هذا المنتج:

*${product.nameAr}*
الكمية: ${quantity} ${product.unitAr}
السعر: ${formatPrice(product.wholesalePrice * quantity)}

شكراً لكم!`
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    toast.success('جاري فتح واتساب...')
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.nameAr,
          text: `${product.nameAr} - ${formatPrice(product.wholesalePrice)}`,
          url: window.location.href,
        })
      } catch {
        // User cancelled sharing
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('تم نسخ رابط المنتج')
    }
  }

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-6">
        <div className="container mx-auto px-4">
          {/* Breadcrumb & Back Button */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowRight className="h-4 w-4 ml-1" />
              رجوع
            </Button>
            <nav className="text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">الرئيسية</Link>
              <span className="mx-2">/</span>
              <Link href="/products" className="hover:text-foreground">المنتجات</Link>
              <span className="mx-2">/</span>
              <Link href={`/products?category=${product.category}`} className="hover:text-foreground">
                {product.categoryAr}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{product.nameAr}</span>
            </nav>
          </div>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Image Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <Card 
                className="relative aspect-square overflow-hidden cursor-pointer group"
                onClick={() => setIsImageModalOpen(true)}
              >
                <Image
                  src={productImages[selectedImageIndex]}
                  alt={product.nameAr}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  priority
                />
                {savingsPercent > 0 && (
                  <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground text-sm px-3 py-1">
                    وفر {savingsPercent}%
                  </Badge>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-4 py-2 rounded-full text-sm">
                    اضغط لتكبير الصورة
                  </span>
                </div>
                
                {/* Image Navigation */}
                {productImages.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </Card>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-accent'
                          : 'border-transparent hover:border-muted-foreground/30'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.nameAr} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              {/* Category */}
              <Badge variant="secondary" className="text-accent">
                {product.categoryAr}
              </Badge>

              {/* Title */}
              <h1 className="text-3xl font-bold text-foreground">{product.nameAr}</h1>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.descriptionAr}
              </p>

              {/* Price */}
              <div className="bg-secondary/50 rounded-xl p-6 space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-accent">
                    {formatPrice(product.wholesalePrice)}
                  </span>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.retailPrice)}
                  </span>
                </div>
                {savings > 0 && (
                  <p className="text-sm text-green-600">
                    توفير {formatPrice(savings)} عند الشراء بسعر الجملة
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm">
                  {product.stock > 0 ? `متوفر (${product.stock} ${product.unitAr})` : 'غير متوفر'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium">الكمية</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-16 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    الإجمالي: {formatPrice(product.wholesalePrice * quantity)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-green-600 text-white hover:bg-green-700 h-12 text-lg"
                  onClick={handleOrderViaWhatsApp}
                  disabled={product.stock === 0}
                >
                  <MessageCircle className="h-5 w-5 ml-2" />
                  اطلب عبر واتساب
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                  onClick={handleShare}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Quick Info */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">الوحدة</span>
                    <span className="font-medium">{product.unitAr}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">القسم</span>
                    <span className="font-medium">{product.categoryAr}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">المخزون</span>
                    <span className="font-medium">{product.stock} {product.unitAr}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="border-t border-border pt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">منتجات مشابهة</h2>
                <Link href={`/products?category=${product.category}`}>
                  <Button variant="outline" size="sm">
                    عرض الكل
                    <ChevronLeft className="h-4 w-4 mr-1" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsImageModalOpen(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setIsImageModalOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <div className="relative w-full max-w-4xl aspect-square mx-4" onClick={(e) => e.stopPropagation()}>
            <Image
              src={productImages[selectedImageIndex]}
              alt={product.nameAr}
              fill
              className="object-contain"
            />
            
            {productImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </>
            )}
          </div>
          
          {/* Thumbnail strip in modal */}
          {productImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(index); }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.nameAr} ${index + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  )
}
