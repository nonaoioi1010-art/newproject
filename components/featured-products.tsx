'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from './product-card'
import { products } from '@/lib/data'

export function FeaturedProducts() {
  const featuredProducts = products.slice(0, 8)

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              منتجات مميزة
            </h2>
            <p className="text-muted-foreground">
              أفضل المنتجات بأسعار الجملة المنافسة
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="hidden md:flex items-center gap-2">
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link href="/products">
            <Button variant="outline" className="w-full">
              عرض جميع المنتجات
              <ArrowLeft className="h-4 w-4 mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
