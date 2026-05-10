'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSlideOver } from '@/components/cart-slide-over'
import { WhatsAppChat } from '@/components/whatsapp-chat'
import { ProductCard } from '@/components/product-card'
import { useStore } from '@/lib/store'
import { products } from '@/lib/data'
import { Star, ShoppingBag, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function FavoritesPage() {
  const { favorites } = useStore()
  
  const favoriteProducts = products.filter(product => 
    favorites.includes(product.id)
  )

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

          <div className="flex items-center gap-3 mb-8">
            <Star className="h-8 w-8 text-accent fill-accent" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">المفضلة</h1>
              <p className="text-muted-foreground">
                {favoriteProducts.length > 0 
                  ? `${favoriteProducts.length} منتج في المفضلة`
                  : 'لا توجد منتجات في المفضلة'
                }
              </p>
            </div>
          </div>

          {favoriteProducts.length === 0 ? (
            <div className="text-center py-16">
              <Star className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
              <h2 className="text-xl font-semibold mb-2">لا توجد منتجات في المفضلة</h2>
              <p className="text-muted-foreground mb-6">
                أضف منتجات إلى المفضلة للوصول إليها بسهولة لاحقاً
              </p>
              <Link href="/products">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <ShoppingBag className="h-4 w-4 ml-2" />
                  تصفح المنتجات
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <CartSlideOver />
      <WhatsAppChat />
    </div>
  )
}
