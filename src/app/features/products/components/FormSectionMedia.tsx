import { Input } from '@heroui/react'
import { ImageIcon } from 'lucide-react'
import type { ProductFormData } from '../types'

interface FormSectionMediaProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void
}

export default function FormSectionMedia({ formData, updateField }: FormSectionMediaProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-lg font-semibold text-text">Product Media</h3>

      {/* Image preview */}
      <div className="mb-4 flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-background p-8">
        {formData.imageUrl ? (
          <img
            src={formData.imageUrl}
            alt="Preview"
            className="max-h-48 rounded-lg object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-text-muted">
            <ImageIcon size={40} />
            <p className="text-sm">Ingresa la URL de la imagen</p>
          </div>
        )}
      </div>

      <Input
        label="URL de imagen"
        placeholder="https://ejemplo.com/imagen.jpg"
        value={formData.imageUrl}
        onValueChange={(v) => updateField('imageUrl', v)}
        classNames={{ label: '!text-text', input: '!text-text', inputWrapper: 'bg-background border-border' }}
      />
    </div>
  )
}
