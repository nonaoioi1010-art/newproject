'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { formatPrice, useStore } from '@/lib/store'
import { ScrollArea } from '@/components/ui/scroll-area'

export function CartSlideOver() {
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart, getCartTotal } = useStore()

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="left" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            سلة التسوق
            <span className="text-sm text-muted-foreground font-normal">
              ({cart.length} منتج)
            </span>
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">سلتك فارغة</h3>
            <p className="text-sm text-muted-foreground mb-6">
              ابدأ التسوق وأضف منتجات إلى سلتك
            </p>
            <Button onClick={() => setCartOpen(false)} asChild>
              <Link href="/products">تصفح المنتجات</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 bg-secondary rounded-lg"
                  >
                    <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.nameAr}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-secondary-foreground truncate">
                        {item.product.nameAr}
                      </h4>
                      <p className="text-accent font-bold mt-1">
                        {formatPrice(item.product.wholesalePrice)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded bg-background hover:bg-muted"
                          disabled={item.quantity <= item.product.minQuantity}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 rounded bg-background hover:bg-muted"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 rounded text-destructive hover:bg-destructive/10 mr-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>المجموع:</span>
                <span className="text-accent">{formatPrice(getCartTotal())}</span>
              </div>
              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                size="lg"
                onClick={() => setCartOpen(false)}
                asChild
              >
                <Link href="/checkout">
                  إتمام الطلب
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
