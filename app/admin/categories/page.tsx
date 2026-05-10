'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Upload, 
  X, 
  FolderOpen,
  Image as ImageIcon,
  Save,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { useStore, type Category } from '@/lib/store'
import { toast } from 'sonner'

export default function AdminCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    nameAr: '',
    name: '',
    image: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetForm = () => {
    setFormData({ nameAr: '', name: '', image: '' })
  }

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('الملف ليس صورة')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('الصورة كبيرة جداً (الحد الأقصى 5MB)')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setFormData(prev => ({ ...prev, image: dataUrl }))
    }
    reader.readAsDataURL(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleAdd = () => {
    if (!formData.nameAr) {
      toast.error('الرجاء إدخال اسم القسم')
      return
    }

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      nameAr: formData.nameAr,
      name: formData.name || formData.nameAr,
      image: formData.image || undefined
    }

    addCategory(newCategory)
    resetForm()
    setIsAddDialogOpen(false)
    toast.success('تم إضافة القسم بنجاح')
  }

  const handleEdit = () => {
    if (!editingCategory) return

    if (!formData.nameAr) {
      toast.error('الرجاء إدخال اسم القسم')
      return
    }

    updateCategory(editingCategory.id, {
      nameAr: formData.nameAr,
      name: formData.name || formData.nameAr,
      image: formData.image || undefined
    })

    setEditingCategory(null)
    resetForm()
    toast.success('تم تحديث القسم بنجاح')
  }

  const handleDelete = (categoryId: string) => {
    deleteCategory(categoryId)
    toast.success('تم حذف القسم بنجاح')
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      nameAr: category.nameAr,
      name: category.name,
      image: category.image || ''
    })
  }

  const CategoryForm = () => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="nameAr">اسم القسم (عربي) *</Label>
        <Input
          id="nameAr"
          value={formData.nameAr}
          onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
          placeholder="مثال: المواد الغذائية"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">اسم القسم (إنجليزي)</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="مثال: Food & Groceries"
          dir="ltr"
        />
      </div>

      <div className="space-y-2">
        <Label>صورة القسم</Label>
        <div className="flex items-start gap-4">
          {formData.image ? (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-border">
              <Image
                src={formData.image}
                alt="صورة القسم"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
          <div className="flex-1 space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 ml-2" />
              رفع صورة
            </Button>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="أو أدخل رابط الصورة"
              className="text-sm"
              dir="ltr"
            />
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>
    </div>
  )

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
          <h1 className="text-3xl font-bold">الأقسام</h1>
          <p className="text-muted-foreground">إدارة أقسام المنتجات</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="h-4 w-4 ml-2" />
              إضافة قسم
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>إضافة قسم جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات القسم الجديد
              </DialogDescription>
            </DialogHeader>
            <CategoryForm />
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            قائمة الأقسام ({categories.length})
          </CardTitle>
          <CardDescription>
            اضغط على أي قسم لتعديله أو حذفه
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">لا توجد أقسام حالياً</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة أول قسم
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="group relative bg-secondary/50 rounded-xl p-4 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-background border border-border flex-shrink-0">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.nameAr}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <FolderOpen className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground truncate">{category.nameAr}</h3>
                      <p className="text-sm text-muted-foreground truncate">{category.name}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 left-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog
                      open={editingCategory?.id === category.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setEditingCategory(null)
                          resetForm()
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEditDialog(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>تعديل القسم</DialogTitle>
                          <DialogDescription>
                            تحديث بيانات القسم
                          </DialogDescription>
                        </DialogHeader>
                        <CategoryForm />
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingCategory(null)
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

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>هل أنت متأكد؟</AlertDialogTitle>
                          <AlertDialogDescription>
                            سيتم حذف القسم &quot;{category.nameAr}&quot; نهائياً. هذا الإجراء لا يمكن التراجع عنه.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            حذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
