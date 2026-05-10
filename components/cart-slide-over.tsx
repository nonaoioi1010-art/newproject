'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useStore, formatPrice } from '@/lib/store'

export function CartSlideOver() {
  const router = useRouter()
  const { cart, isCartOpen, setCartOpen, updateQuantity, removeFromCart, getCartTotal } = useStore()

  const handleCheckout = () => {
    setCartOpen(false)
    router.push('/checkout')
  }

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="left" className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            سلة التسوق
            {cart.length > 0 && (
              <span className="text-sm text-muted-foreground">
                ({cart.reduce((t, i) => t + i.quantity, 0)} منتج)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">السلة فارغة</h3>
            <p className="text-muted-foreground mb-6">أضف منتجات للبدء في التسوق</p>
            <Button onClick={() => setCartOpen(false)}>تصفح المنتجات</Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 bg-secondary/50 rounded-lg"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.nameAr}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground line-clamp-2 text-sm">
                      {item.product.nameAr}
                    </h4>
                    <p className="text-accent font-bold mt-1">
                      {formatPrice(item.product.wholesalePrice)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive mr-auto"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>الإجمالي:</span>
                <span className="text-accent">{formatPrice(getCartTotal())}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => setCartOpen(false)}>
                  تسوق المزيد
                </Button>
                <Button 
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={handleCheckout}
                >
                  إتمام الطلب
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
