import { useEffect, useRef, useState } from 'react'
import { Button } from '@heroui/react'

interface BannerImageFieldProps {
  label: string
  hint: string
  preview: string | null
  previewAlt: string
  onChange: (file: File | null) => void
}

export default function BannerImageField({
  label,
  hint,
  preview,
  previewAlt,
  onChange,
}: BannerImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)

  useEffect(() => {
    if (!preview) setFileName(null)
  }, [preview])

  const status = fileName ?? (preview ? 'Imagen actual' : 'Ningún archivo seleccionado')

  return (
    <div className="min-w-0">
      <p className="mb-2 text-sm text-text">{label}</p>
      {preview && (
        <img
          src={preview}
          alt={previewAlt}
          className="mb-2 h-28 w-full rounded-lg object-cover"
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null
          setFileName(file?.name ?? null)
          onChange(file)
        }}
      />
      <Button
        size="sm"
        variant="flat"
        color="warning"
        className="w-full max-w-full"
        onPress={() => inputRef.current?.click()}
      >
        Elegir archivo
      </Button>
      <p className="mt-1 truncate text-xs text-text-muted" title={status}>
        {status}
      </p>
      <p className="mt-1 text-xs leading-snug text-text-muted">{hint}</p>
    </div>
  )
}
