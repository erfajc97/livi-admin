import { Select, SelectItem } from '@heroui/react'
import { useCategoriesQuery } from '@/app/tanstack-queries/productsQuery'
import type { ProductFormData } from '../types'

interface FormSectionCategoryProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) => void
}

const selectClasses = {
  label: '!text-text',
  trigger: 'bg-background border-border',
  value: '!text-text',
  popoverContent: 'bg-surface text-text',
}

const itemClasses = { base: 'text-text', title: '!text-text' }

export default function FormSectionCategory({
  formData,
  updateField,
}: FormSectionCategoryProps) {
  const { data: categories = [] } = useCategoriesQuery()

  const selectedCategory = categories.find(
    (c) => String(c.id) === formData.categoryId,
  )
  const marcas = selectedCategory?.marcas ?? []

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-lg font-semibold text-text">Categoría</h3>
      <div className="flex flex-col gap-4">
        <Select
          label="Categoría"
          selectedKeys={formData.categoryId ? [formData.categoryId] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string
            if (value) {
              updateField('categoryId', value)
              updateField('marcaId', '')
            }
          }}
          classNames={selectClasses}
          isRequired
        >
          {categories.map((c) => (
            <SelectItem key={String(c.id)} classNames={itemClasses}>
              {c.name}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Marca"
          selectedKeys={formData.marcaId ? [formData.marcaId] : []}
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as string
            if (value) updateField('marcaId', value)
          }}
          classNames={selectClasses}
          isDisabled={marcas.length === 0}
          isRequired
        >
          {marcas.map((s) => (
            <SelectItem key={String(s.id)} classNames={itemClasses}>
              {s.name}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  )
}
