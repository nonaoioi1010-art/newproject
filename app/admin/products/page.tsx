'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, Search, Package, Upload, X, ImageIcon, ArrowRight, Home, Eye, Save, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatPrice, useStore, type Product } from '@/lib/store'
import { products as initialProducts } from '@/lib/data'
import { toast } from 'sonner'

// Separate form component to prevent focus issues
function ProductFormFields({
  formData,
  onFormChange,
  categories,
  imageMode,
  setImageMode,
  imageUrl,
  setImageUrl,
  uploadedImages,
  handleImageUpload,
  removeImage,
  fileInputRef
}: {
  formData: {
    nameAr: string
    descriptionAr: string
    wholesalePrice: string
    retailPrice: string
    category: string
    stock: string
    unitAr: string
  }
  onFormChange: (field: string, value: string) => void
  categories: { id: string; nameAr: string }[]
  imageMode: 'upload' | 'url'
  setImageMode: (mode: 'upload' | 'url') => void
  imageUrl: string
  setImageUrl: (url: string) => void
  uploadedImages: string[]
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (index: number) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nameAr">اسم المنتج *</Label>
          <Input
            id="nameAr"
            value={formData.nameAr}
            onChange={(e) => onFormChange('nameAr', e.target.value)}
            placeholder="أرز بسمتي ٢٥ كيلو"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">القسم *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => onFormChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر القسم" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descriptionAr">الوصف</Label>
        <Input
          id="descriptionAr"
          value={formData.descriptionAr}
          onChange={(e) => onFormChange('descriptionAr', e.target.value)}
          placeholder="وصف المنتج"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="wholesalePrice">سعر الجملة (ر.ي) *</Label>
          <Input
            id="wholesalePrice"
            type="number"
            value={formData.wholesalePrice}
            onChange={(e) => onFormChange('wholesalePrice', e.target.value)}
            placeholder="45000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="retailPrice">سعر التجزئة (ر.ي)</Label>
          <Input
            id="retailPrice"
            type="number"
            value={formData.retailPrice}
            onChange={(e) => onFormChange('retailPrice', e.target.value)}
            placeholder="52000"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock">المخزون</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => onFormChange('stock', e.target.value)}
            placeholder="500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unitAr">الوحدة</Label>
          <Input
            id="unitAr"
            value={formData.unitAr}
            onChange={(e) => onFormChange('unitAr', e.target.value)}
            placeholder="كيس"
          />
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="space-y-4">
        <Label>صور المنتج</Label>
        
        <Tabs value={imageMode} onValueChange={(v) => setImageMode(v as 'upload' | 'url')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              رفع صورة
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              رابط صورة
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">
                اضغط لرفع صور أو اسحب الملفات هنا
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG حتى 5MB لكل صورة
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">
                  الصور المرفوعة ({uploadedImages.length})
                </Label>
                <div className="flex flex-wrap gap-2">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="w-20 h-20 rounded-lg overflow-hidden border border-border">
                        <Image
                          src={img}
                          alt={`صورة ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {index === 0 && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] bg-accent text-accent-foreground px-1 rounded">
                          رئيسية
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">
                أدخل رابط URL مباشر للصورة
              </p>
            </div>
            
            {/* URL Image Preview */}
            {imageUrl && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border">
                <Image
                  src={imageUrl}
                  alt="معاينة الصورة"
                  fill
                  className="object-cover"
                  onError={() => toast.error('فشل تحميل الصورة')}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function AdminProductsPage() {
  const { categories } = useStore()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    nameAr: '',
    descriptionAr: '',
    wholesalePrice: '',
    retailPrice: '',
    category: '',
    stock: '',
    unitAr: '',
  })
  
  // Image management
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')
  const [imageUrl, setImageUrl] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const filteredProducts = useMemo(() => 
    products.filter(
      (product) =>
        product.nameAr.includes(searchQuery) ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [products, searchQuery]
  )

  const resetForm = useCallback(() => {
    setFormData({
      nameAr: '',
      descriptionAr: '',
      wholesalePrice: '',
      retailPrice: '',
      category: '',
      stock: '',
      unitAr: '',
    })
    setImageUrl('')
    setUploadedImages([])
    setImageMode('upload')
  }, [])

  const handleFormChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`الملف ${file.name} ليس صورة`)
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`الملف ${file.name} كبير جداً (الحد الأقصى 5MB)`)
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        setUploadedImages((prev) => [...prev, dataUrl])
      }
      reader.readAsDataURL(file)
    })

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const removeImage = useCallback((index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const getProductImage = useCallback((): string => {
    if (imageMode === 'url' && imageUrl) {
      return imageUrl
    }
    if (uploadedImages.length > 0) {
      return uploadedImages[0]
    }
    return 'https://via.placeholder.com/400'
  }, [imageMode, imageUrl, uploadedImages])

  const handleAdd = useCallback(() => {
    if (!formData.nameAr || !formData.wholesalePrice || !formData.category) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة')
      return
    }

    const category = categories.find(c => c.id === formData.category)
    const newProduct: Product = {
      id: `product-${Date.now()}`,
      name: formData.nameAr,
      nameAr: formData.nameAr,
      description: formData.descriptionAr,
      descriptionAr: formData.descriptionAr,
      wholesalePrice: Number(formData.wholesalePrice),
      retailPrice: Number(formData.retailPrice) || Number(formData.wholesalePrice),
      minQuantity: 1,
      category: formData.category,
      categoryAr: category?.nameAr || '',
      image: getProductImage(),
      stock: Number(formData.stock) || 0,
      unit: formData.unitAr,
      unitAr: formData.unitAr,
    }

    setProducts(prev => [...prev, newProduct])
    resetForm()
    setIsAddDialogOpen(false)
    setShowSaveSuccess(true)
    toast.success('تم إضافة المنتج بنجاح')
  }, [formData, categories, getProductImage, resetForm])

  const handleEdit = useCallback(() => {
    if (!editingProduct) return

    const category = categories.find(c => c.id === formData.category)
    setProducts(prev => prev.map((p) =>
      p.id === editingProduct.id
        ? {
            ...p,
            nameAr: formData.nameAr,
            name: formData.nameAr,
            descriptionAr: formData.descriptionAr,
            description: formData.descriptionAr,
            wholesalePrice: Number(formData.wholesalePrice),
            retailPrice: Number(formData.retailPrice) || Number(formData.wholesalePrice),
            minQuantity: 1,
            category: formData.category,
            categoryAr: category?.nameAr || '',
            image: getProductImage(),
            stock: Number(formData.stock),
            unitAr: formData.unitAr,
            unit: formData.unitAr,
          }
        : p
    ))

    setEditingProduct(null)
    resetForm()
    setShowSaveSuccess(true)
    toast.success('تم تحديث المنتج بنجاح')
  }, [editingProduct, formData, categories, getProductImage, resetForm])

  const handleDelete = useCallback((productId: string) => {
    setProducts(prev => prev.filter((p) => p.id !== productId))
    toast.success('تم حذف المنتج بنجاح')
  }, [])

  const openEditDialog = useCallback((product: Product) => {
    setEditingProduct(product)
    setFormData({
      nameAr: product.nameAr,
      descriptionAr: product.descriptionAr,
      wholesalePrice: product.wholesalePrice.toString(),
      retailPrice: product.retailPrice.toString(),
      category: product.category,
      stock: product.stock.toString(),
      unitAr: product.unitAr,
    })
    // Check if current image is a data URL or external URL
    if (product.image.startsWith('data:')) {
      setUploadedImages([product.image])
      setImageMode('upload')
    } else {
      setImageUrl(product.image)
      setImageMode('url')
    }
  }, [])

  // Success dialog after save
  if (showSaveSuccess) {
    return (
      <div className="space-y-6">
        <Card className="max-w-md mx-auto mt-20">
          <CardContent className="pt-6 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-2">تم الحفظ بنجاح!</h2>
              <p className="text-muted-foreground">تم حفظ التغييرات على المنتج</p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={() => setShowSaveSuccess(false)}
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة منتج آخر
              </Button>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full">
                  <Home className="h-4 w-4 ml-2" />
                  الذهاب للصفحة الرئيسية
                </Button>
              </Link>
              <Link href="/products" className="w-full">
                <Button variant="ghost" className="w-full">
                  <Eye className="h-4 w-4 ml-2" />
                  معاينة المنتجات
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            <ArrowRight className="h-4 w-4 ml-2" />
            رجوع
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">المنتجات</h1>
          <p className="text-muted-foreground">إدارة منتجات المتجر</p>
        </div>

        {/* Add Product Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>إضافة منتج جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات المنتج الجديد
              </DialogDescription>
            </DialogHeader>
            <ProductFormFields
              formData={formData}
              onFormChange={handleFormChange}
              categories={categories}
              imageMode={imageMode}
              setImageMode={setImageMode}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              uploadedImages={uploadedImages}
              handleImageUpload={handleImageUpload}
              removeImage={removeImage}
              fileInputRef={fileInputRef}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                إلغاء
              </Button>
              <Button onClick={handleAdd} className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Save className="h-4 w-4 ml-2" />
                إضافة
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            قائمة المنتجات ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">الصورة</TableHead>
                  <TableHead>المنتج</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>سعر الجملة</TableHead>
                  <TableHead>المخزون</TableHead>
                  <TableHead className="w-[100px]">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative w-12 h-12 rounded overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.nameAr}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.nameAr}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {product.descriptionAr}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{product.categoryAr}</TableCell>
                    <TableCell className="font-bold text-accent">
                      {formatPrice(product.wholesalePrice)}
                    </TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* Edit Dialog */}
                        <Dialog
                          open={editingProduct?.id === product.id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setEditingProduct(null)
                              resetForm()
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(product)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>تعديل المنتج</DialogTitle>
                              <DialogDescription>
                                تحديث بيانات المنتج
                              </DialogDescription>
                            </DialogHeader>
                            <ProductFormFields
                              formData={formData}
                              onFormChange={handleFormChange}
                              categories={categories}
                              imageMode={imageMode}
                              setImageMode={setImageMode}
                              imageUrl={imageUrl}
                              setImageUrl={setImageUrl}
                              uploadedImages={uploadedImages}
                              handleImageUpload={handleImageUpload}
                              removeImage={removeImage}
                              fileInputRef={fileInputRef}
                            />
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setEditingProduct(null)
                                  resetForm()
                                }}
                              >
                                إلغاء
                              </Button>
                              <Button onClick={handleEdit} className="bg-accent text-accent-foreground hover:bg-accent/90">
                                <Save className="h-4 w-4 ml-2" />
                                حفظ التغييرات
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Delete Dialog */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                              <AlertDialogDescription>
                                سيتم حذف المنتج &quot;{product.nameAr}&quot; نهائياً. هذا الإجراء لا يمكن التراجع عنه.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>إلغاء</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
