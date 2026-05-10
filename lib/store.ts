import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Product {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  wholesalePrice: number
  retailPrice: number
  minQuantity: number
  category: string
  categoryAr: string
  image: string
  stock: number
  unit: string
  unitAr: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  isAdmin: boolean
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  discount: number
  deliveryDetails: {
    fullName: string
    phone: string
    address: string
    city?: string
    neighborhood?: string
    street?: string
    buildingNumber?: string
    landmark?: string
    notes?: string
    latitude?: number
    longitude?: number
  }
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  createdAt: string
}

// Deal of day interface
export interface DealOfDay {
  productId: string
  productName: string
  productImage: string
  productDescription: string
  originalPrice: number
  discount: number
  endsAt: string
  isActive: boolean
}

// Site settings interface
export interface SiteSettings {
  siteName: string
  siteDescription: string
  logoUrl: string
  whatsappNumber: string
  accentColor: string
  primaryButtonText: string
  secondaryButtonText: string
  heroSlides: {
    id: number
    title: string
    subtitle: string
    description: string
    image: string
    cta: string
    ctaLink?: string
  }[]
  dealOfDay: DealOfDay
}

// Category interface
export interface Category {
  id: string
  name: string
  nameAr: string
  image?: string
}

interface AppState {
  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  
  // Favorites
  favorites: string[]
  addToFavorites: (productId: string) => void
  removeFromFavorites: (productId: string) => void
  isFavorite: (productId: string) => boolean
  
  // Auth
  user: User | null
  setUser: (user: User | null) => void
  
  // Orders
  orders: Order[]
  addOrder: (order: Order) => void
  
  // Cart visibility
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void
  
  // Site Settings
  siteSettings: SiteSettings
  updateSiteSettings: (settings: Partial<SiteSettings>) => void
  
  // Categories
  categories: Category[]
  addCategory: (category: Category) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
  
  // Products management
  products: Product[]
  addProduct: (product: Product) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
}

// Default site settings
const defaultSiteSettings: SiteSettings = {
  siteName: 'جملة العم',
  siteDescription: 'منصة تسوق الجملة الأولى في اليمن',
  logoUrl: '',
  whatsappNumber: '967772652212',
  accentColor: '#ff8c00',
  primaryButtonText: 'أضف للسلة',
  secondaryButtonText: 'تسوق الآن',
  heroSlides: [
    {
      id: 1,
      title: 'أفضل أسعار الجملة',
      subtitle: 'وفر أكثر مع كميات أكبر',
      description: 'تسوق من أكبر تشكيلة منتجات بأسعار الجملة',
      image: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=1200&h=600&fit=crop',
      cta: 'تسوق الآن',
      ctaLink: '/products',
    },
    {
      id: 2,
      title: 'عروض خاصة',
      subtitle: 'خصومات تصل إلى ٣٠٪',
      description: 'استفد من عروضنا الحصرية على المنتجات المختارة',
      image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=600&fit=crop',
      cta: 'اكتشف العروض',
      ctaLink: '/products',
    },
    {
      id: 3,
      title: 'توصيل سريع',
      subtitle: 'لجميع محافظات اليمن',
      description: 'نوصل طلباتك إلى باب منزلك في أسرع وقت',
      image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=1200&h=600&fit=crop',
      cta: 'اطلب الآن',
      ctaLink: '/products',
    },
  ],
  dealOfDay: {
    productId: 'deal-1',
    productName: 'أرز بسمتي فاخر ٢٥ كيلو',
    productImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&h=800&fit=crop',
    productDescription: 'أرز بسمتي هندي فاخر طويل الحبة، مثالي للمناسبات والطبخ اليومي',
    originalPrice: 45000,
    discount: 20,
    endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
  },
}

// Default categories
const defaultCategories: Category[] = [
  { id: 'food', name: 'Food & Groceries', nameAr: 'المواد الغذائية', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop' },
  { id: 'beverages', name: 'Beverages', nameAr: 'المشروبات', image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=200&h=200&fit=crop' },
  { id: 'cleaning', name: 'Cleaning Supplies', nameAr: 'مواد التنظيف', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=200&h=200&fit=crop' },
  { id: 'personal', name: 'Personal Care', nameAr: 'العناية الشخصية', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop' },
  { id: 'electronics', name: 'Electronics', nameAr: 'الإلكترونيات', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop' },
  { id: 'home', name: 'Home & Kitchen', nameAr: 'المنزل والمطبخ', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop' },
]

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Cart
      cart: [],
      addToCart: (product, quantity) => {
        const cart = get().cart
        const existingItem = cart.find(item => item.product.id === product.id)
        
        if (existingItem) {
          set({
            cart: cart.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({ cart: [...cart, { product, quantity }] })
        }
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.product.id !== productId) })
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId)
          return
        }
        set({
          cart: get().cart.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        })
      },
      clearCart: () => set({ cart: [] }),
      getCartTotal: () => {
        return get().cart.reduce(
          (total, item) => total + item.product.wholesalePrice * item.quantity,
          0
        )
      },
      
      // Favorites
      favorites: [],
      addToFavorites: (productId) => {
        const favorites = get().favorites
        if (!favorites.includes(productId)) {
          set({ favorites: [...favorites, productId] })
        }
      },
      removeFromFavorites: (productId) => {
        set({ favorites: get().favorites.filter(id => id !== productId) })
      },
      isFavorite: (productId) => get().favorites.includes(productId),
      
      // Auth
      user: null,
      setUser: (user) => set({ user }),
      
      // Orders
      orders: [],
      addOrder: (order) => set({ orders: [...get().orders, order] }),
      
      // Cart visibility
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
      
      // Site Settings
      siteSettings: defaultSiteSettings,
      updateSiteSettings: (settings) => set({ 
        siteSettings: { ...get().siteSettings, ...settings } 
      }),
      
      // Categories
      categories: defaultCategories,
      addCategory: (category) => set({ 
        categories: [...get().categories, category] 
      }),
      updateCategory: (id, category) => set({
        categories: get().categories.map(c => 
          c.id === id ? { ...c, ...category } : c
        )
      }),
      deleteCategory: (id) => set({
        categories: get().categories.filter(c => c.id !== id)
      }),
      
      // Products management
      products: [],
      addProduct: (product) => set({ 
        products: [...get().products, product] 
      }),
      updateProduct: (id, product) => set({
        products: get().products.map(p => 
          p.id === id ? { ...p, ...product } : p
        )
      }),
      deleteProduct: (id) => set({
        products: get().products.filter(p => p.id !== id)
      }),
    }),
    {
      name: 'jomlah-store',
      partialize: (state) => ({ 
        cart: state.cart, 
        user: state.user,
        orders: state.orders,
        favorites: state.favorites,
        siteSettings: state.siteSettings,
        categories: state.categories,
        products: state.products,
      }),
    }
  )
)

// Format price in Yemeni Rial
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ar-YE', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' ر.ي'
}
