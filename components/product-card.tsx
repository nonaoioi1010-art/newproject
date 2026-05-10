'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatPrice, useStore, type Product } from '@/lib/store'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, favorites, addToFavorites, removeFromFavorites } = useStore()
  
  const isFavorite = favorites.includes(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    toast.success(`تمت إضافة ${product.nameAr} إلى السلة`)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isFavorite) {
      removeFromFavorites(product.id)
      toast.success('تمت الإزالة من المفضلة')
    } else {
      addToFavorites(product.id)
      toast.success('تمت الإضافة إلى المفضلة')
    }
  }

  const savings = product.retailPrice - product.wholesalePrice
  const savingsPercent = Math.round((savings / product.retailPrice) * 100)

  return (
    <Link href={`/product/${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative h-48 bg-secondary">
          <Image
            src={product.image}
            alt={product.nameAr}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {savingsPercent > 0 && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-accent text-accent-foreground text-xs font-bold rounded">
              وفر {savingsPercent}%
            </div>
          )}
          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-2 left-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-sm"
          >
            <Star 
              className={`h-4 w-4 transition-colors ${
                isFavorite ? 'text-accent fill-accent' : 'text-muted-foreground'
              }`} 
            />
          </button>
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
        </div>
        <CardContent className="p-4">
          <div className="text-xs text-accent font-medium mb-1">
            {product.categoryAr}
          </div>
          <h3 className="font-bold text-card-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {product.nameAr}
          </h3>
          
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-bold text-accent">
              {formatPrice(product.wholesalePrice)}
            </span>
            {savings > 0 && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.retailPrice)}
              </span>
            )}
          </div>

          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 ml-2" />
            أضف للسلة
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
