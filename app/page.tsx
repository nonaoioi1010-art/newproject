import { Header } from '@/components/header'
import { HeroSlider } from '@/components/hero-slider'
import { CategoriesSection } from '@/components/categories-section'
import { DealOfDay } from '@/components/deal-of-day'
import { FeaturedProducts } from '@/components/featured-products'
import { CartSlideOver } from '@/components/cart-slide-over'
import { Footer } from '@/components/footer'
import { WhatsAppChat } from '@/components/whatsapp-chat'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-6">
          <div className="container mx-auto px-4">
            <HeroSlider />
          </div>
        </section>
        <CategoriesSection />
        <DealOfDay />
        <FeaturedProducts />
      </main>
      <Footer />
      <CartSlideOver />
      <WhatsAppChat />
    </div>
  )
}
