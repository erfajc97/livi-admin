import { useEffect } from 'react'
import { Spinner } from '@heroui/react'
import { useProductFormHook } from '../hooks/useProductFormHook'
import { useCreateProductMutation, useUpdateProductMutation } from '../mutations/useProductMutations'
import { useProductByIdQuery } from '@/app/tanstack-queries/productsQuery'
import ProductForm from './ProductForm'
import type { Product } from '../types'

interface ProductFormViewProps {
  product: Product | null
  onBack: () => void
}

export default function ProductFormView({ product, onBack }: ProductFormViewProps) {
  const isEdit = !!product
  const {
    formData,
    variations,
    updateField,
    resetForm,
    loadProduct,
    addVariation,
    updateVariation,
    removeVariation,
    buildPayload,
  } = useProductFormHook()

  const createMutation = useCreateProductMutation()
  const updateMutation = useUpdateProductMutation()

  const { data: fullProduct, isLoading } = useProductByIdQuery(product?.id ?? 0, isEdit)

  useEffect(() => {
    if (fullProduct) loadProduct(fullProduct)
  }, [fullProduct, loadProduct])

  useEffect(() => {
    if (!isEdit) resetForm()
  }, [isEdit, resetForm])

  const handleSubmit = () => {
    const payload = buildPayload()
    if (isEdit && product) {
      updateMutation.mutate({ id: product.id, data: payload }, { onSuccess: onBack })
    } else {
      createMutation.mutate(payload, { onSuccess: onBack })
    }
  }

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="warning" />
      </div>
    )
  }

  return (
    <ProductForm
      formData={formData}
      variations={variations}
      updateField={updateField}
      addVariation={addVariation}
      updateVariation={updateVariation}
      removeVariation={removeVariation}
      onSubmit={handleSubmit}
      onBack={onBack}
      isSubmitting={createMutation.isPending || updateMutation.isPending}
      isEdit={isEdit}
    />
  )
}
