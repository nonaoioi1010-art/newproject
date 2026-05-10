'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Package, Coffee, Sparkles, Heart, Cpu, Home, FolderOpen } from 'lucide-react'
import { useStore } from '@/lib/store'

const categoryIcons: Record<string, React.ElementType> = {
  food: Package,
  beverages: Coffee,
  cleaning: Sparkles,
  personal: Heart,
  electronics: Cpu,
  home: Home,
}

export function CategoriesSection() {
  const { categories } = useStore()

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            تسوق حسب القسم
          </h2>
          <p className="text-muted-foreground">
            اكتشف مجموعتنا الواسعة من المنتجات بأسعار الجملة
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = categoryIcons[category.id] || FolderOpen
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group flex flex-col items-center p-6 bg-card rounded-xl border border-border hover:border-accent hover:shadow-lg transition-all"
              >
                {category.image ? (
                  <div className="w-16 h-16 mb-4 rounded-full overflow-hidden relative">
                    <Image
                      src={category.image}
                      alt={category.nameAr}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 mb-4 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Icon className="h-8 w-8 text-accent" />
                  </div>
                )}
                <span className="text-sm font-medium text-card-foreground text-center">
                  {category.nameAr}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
