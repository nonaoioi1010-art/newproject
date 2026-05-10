'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { heroSlides } from '@/lib/data'
import Link from 'next/link'

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-xl">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-l from-primary/90 to-primary/40" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-8">
              <div className="max-w-lg">
                <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-accent text-accent-foreground rounded-full">
                  {slide.subtitle}
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4 text-balance">
                  {slide.title}
                </h2>
                <p className="text-lg text-primary-foreground/80 mb-6 text-pretty">
                  {slide.description}
                </p>
                <Link href="/products">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    {slide.cta}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
        aria-label="الشريحة السابقة"
      >
        <ChevronRight className="h-6 w-6 text-primary-foreground" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors"
        aria-label="الشريحة التالية"
      >
        <ChevronLeft className="h-6 w-6 text-primary-foreground" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-accent' : 'bg-primary-foreground/40'
            }`}
            aria-label={`الانتقال إلى الشريحة ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
