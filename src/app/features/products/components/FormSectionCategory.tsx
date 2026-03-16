import { Select, SelectItem } from '@heroui/react'
import { useCategoriesQuery } from '@/app/tanstack-queries/productsQuery'
import { PRODUCT_TYPES } from '../data'
import type { ProductFormData } from '../types'

interface FormSectionCategoryProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void
}

export default function FormSectionCategory({ formData, updateField }: FormSectionCategoryProps) {
  const { data: categories = [] } = useCategoriesQuery()

  const selectedCategory = categories.find((c) => String(c.id) === formData.categoryId)
  const subcategories = selectedCategory?.subcategories ?? []

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-lg font-semibold text-text">Categoría</h3>
      <div className="flex flex-col gap-4">
        <Select
          label="Tipo de producto"
          selectedKeys={formData.type ? [formData.type] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string
            if (value) updateField('type', value as ProductFormData['type'])
          }}
          classNames={{ label: '!text-text', trigger: 'bg-background border-border', value: '!text-text', popoverContent: 'bg-surface text-text' }}
        >
          {PRODUCT_TYPES.map((t) => (
            <SelectItem key={t.value} classNames={{ base: 'text-text', title: '!text-text' }}>{t.label}</SelectItem>
          ))}
        </Select>

        <Select
          label="Categoría"
          selectedKeys={formData.categoryId ? [formData.categoryId] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string
            if (value) {
              updateField('categoryId', value)
              updateField('subcategoryId', '')
            }
          }}
          classNames={{ label: '!text-text', trigger: 'bg-background border-border', value: '!text-text', popoverContent: 'bg-surface text-text' }}
          isRequired
        >
          {categories.map((c) => (
            <SelectItem key={String(c.id)} classNames={{ base: 'text-text', title: '!text-text' }}>{c.name}</SelectItem>
          ))}
        </Select>

        <Select
          label="Subcategoría"
          selectedKeys={formData.subcategoryId ? [formData.subcategoryId] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string
            if (value) updateField('subcategoryId', value)
          }}
          classNames={{ label: '!text-text', trigger: 'bg-background border-border', value: '!text-text', popoverContent: 'bg-surface text-text' }}
          isDisabled={subcategories.length === 0}
          isRequired
        >
          {subcategories.map((s) => (
            <SelectItem key={String(s.id)} classNames={{ base: 'text-text', title: '!text-text' }}>{s.name}</SelectItem>
          ))}
        </Select>
      </div>
    </div>
  )
}
