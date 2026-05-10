import Link from 'next/link'
import { Package, Coffee, Sparkles, Heart, Cpu, Home, ArrowRight } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartSlideOver } from '@/components/cart-slide-over'
import { categories, products } from '@/lib/data'

const categoryIcons: Record<string, React.ElementType> = {
  food: Package,
  beverages: Coffee,
  cleaning: Sparkles,
  personal: Heart,
  electronics: Cpu,
  home: Home,
}

const categoryImages: Record<string, string> = {
  food: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop',
  beverages: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=400&fit=crop',
  cleaning: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop',
  personal: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=400&fit=crop',
  electronics: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
  home: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
}

export default function CategoriesPage() {
  const getCategoryProductCount = (categoryId: string) => {
    return products.filter(p => p.category === categoryId).length
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

          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              تسوق حسب القسم
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              استكشف مجموعتنا الواسعة من المنتجات المصنفة بعناية لتسهيل تجربة التسوق
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = categoryIcons[category.id] || Package
              const productCount = getCategoryProductCount(category.id)
              
              return (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="group relative overflow-hidden rounded-2xl h-64 bg-card border border-border hover:border-accent transition-all"
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${categoryImages[category.id]})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-primary/20" />
                  
                  {/* Content */}
                  <div className="relative h-full p-6 flex flex-col justify-end">
                    <div className="w-14 h-14 mb-4 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="h-7 w-7 text-accent" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                      {category.nameAr}
                    </h2>
                    <p className="text-sm text-primary-foreground/70">
                      {productCount} منتج متوفر
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
      <CartSlideOver />
    </div>
  )
}
