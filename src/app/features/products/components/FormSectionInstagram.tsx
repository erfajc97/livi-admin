import { prepareImageUpload } from '@/app/helpers/prepareImageUpload'
import { useRef, useState } from 'react'
import { Button, Input, addToast } from '@heroui/react'
import { Plus, Trash2, ImagePlus } from 'lucide-react'
import axiosInstance from '@/app/config/axiosConfig'
import type { InstagramPostInput, ProductFormData } from '../types'

interface FormSectionInstagramProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) => void
}

const fieldClassNames = {
  label: '!text-text',
  input: '!text-text',
  inputWrapper: 'bg-background border-border',
}

/**
 * Posts de Instagram de la ficha: cada fila es el enlace del post y la imagen
 * que se muestra en la card. La imagen se puede SUBIR desde el explorador de
 * archivos (botón sobre la miniatura) o pegar como URL — ambas funcionan.
 * Si el producto no tiene posts, la ficha muestra la selección general de marca.
 */
export default function FormSectionInstagram({
  formData,
  updateField,
}: FormSectionInstagramProps) {
  const posts = formData.instagramPosts
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const fileRefs = useRef<(HTMLInputElement | null)[]>([])

  const setPosts = (next: InstagramPostInput[]) =>
    updateField('instagramPosts', next)

  const updatePost = (index: number, field: keyof InstagramPostInput, value: string) =>
    setPosts(posts.map((p, i) => (i === index ? { ...p, [field]: value } : p)))

  const handleUpload = async (index: number, file: File) => {
    setUploadingIndex(index)
    try {
      const body = new FormData()
      // Cloudinary free corta en 10 MB: se recomprime antes de enviar.
      body.append('file', await prepareImageUpload(file))
      const { data } = await axiosInstance.post('/uploads/image', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const url = data?.data?.url ?? data?.url
      if (!url) throw new Error('La API no devolvió la URL de la imagen')
      updatePost(index, 'image', url)
      addToast({ title: 'Foto subida', color: 'success' })
    } catch (err: any) {
      addToast({
        title: err?.response?.data?.message || 'Error al subir la foto',
        color: 'danger',
      })
    } finally {
      setUploadingIndex(null)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text">
            Instagram de la ficha
          </h3>
          <p className="mt-1 text-xs text-text-muted">
            Posts que aparecen al final de la página de este producto. La imagen
            se puede subir desde tu equipo (clic en la miniatura) o pegar como URL;
            el enlace abre el post en Instagram.
          </p>
        </div>
        <Button
          size="sm"
          color="warning"
          variant="flat"
          startContent={<Plus size={14} />}
          onPress={() => setPosts([...posts, { url: '', image: '' }])}
        >
          Agregar post
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-text-muted">
          Sin posts propios: se mostrará la selección general de marca.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-bg p-3"
            >
              {/* Miniatura = botón de subida (explorador de archivos) */}
              <button
                type="button"
                onClick={() => fileRefs.current[i]?.click()}
                title={post.image ? 'Cambiar foto' : 'Subir foto desde tu equipo'}
                className="group relative h-14 w-14 shrink-0 overflow-hidden rounded border border-border bg-background"
              >
                {post.image ? (
                  <img
                    src={post.image}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:opacity-60"
                  />
                ) : (
                  <span className="flex h-full w-full flex-col items-center justify-center gap-0.5 text-text-muted transition group-hover:text-text">
                    <ImagePlus size={16} />
                    <span className="text-[8px] uppercase tracking-wide">
                      {uploadingIndex === i ? 'Subiendo…' : 'Subir foto'}
                    </span>
                  </span>
                )}
                {post.image && (
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
                    <ImagePlus size={16} className="text-white drop-shadow" />
                  </span>
                )}
              </button>
              <input
                ref={(el) => { fileRefs.current[i] = el }}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleUpload(i, file)
                  e.target.value = ''
                }}
              />

              <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-2">
                <Input
                  label="URL del post"
                  placeholder="https://www.instagram.com/p/…"
                  size="sm"
                  value={post.url}
                  onValueChange={(v) => updatePost(i, 'url', v)}
                  classNames={fieldClassNames}
                />
                <Input
                  label="URL de la imagen (o súbela con la miniatura)"
                  placeholder="https://…/post.jpg"
                  size="sm"
                  value={post.image}
                  onValueChange={(v) => updatePost(i, 'image', v)}
                  classNames={fieldClassNames}
                />
              </div>
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => setPosts(posts.filter((_, j) => j !== i))}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
