import { Input, Textarea, Switch } from '@heroui/react'
import { Upload, X } from 'lucide-react'
import type { BlogFormData } from '../hooks/useBlogFormHook'

interface BlogFormProps {
  formData: BlogFormData
  imagePreview: string | null
  onInputChange: (field: keyof BlogFormData, value: string | boolean) => void
  onImageChange: (file: File | null) => void
}

export default function BlogForm({
  formData,
  imagePreview,
  onInputChange,
  onImageChange,
}: BlogFormProps) {
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    onImageChange(file)
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Título"
        placeholder="Título del blog post"
        value={formData.title}
        onValueChange={(val) => onInputChange('title', val)}
        isRequired
        variant="bordered"
      />

      <Textarea
        label="Descripción"
        placeholder="Descripción del blog post"
        value={formData.content}
        onValueChange={(val) => onInputChange('content', val)}
        isRequired
        variant="bordered"
        minRows={6}
        maxRows={16}
      />

      {/* Image upload */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text">
          Imagen destacada
        </label>
        <div className="flex items-start gap-3">
          {imagePreview && (
            <div className="relative h-32 w-48 overflow-hidden rounded-lg border border-border">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onImageChange(null)}
                className="absolute right-1 top-1 rounded-full bg-danger p-1 text-white hover:bg-danger/80"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <label className="flex h-32 w-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-bg-alt transition hover:border-accent">
            <Upload size={24} className="text-text-muted" />
            <span className="mt-2 text-xs text-text-muted">Subir imagen</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <Switch
        isSelected={formData.isPublished}
        onValueChange={(val) => onInputChange('isPublished', val)}
        color="warning"
      >
        <span className="text-sm text-text">Publicar inmediatamente</span>
      </Switch>
    </div>
  )
}
