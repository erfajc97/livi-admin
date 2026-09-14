import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
} from '@heroui/react'
import { Plus, Search, X } from 'lucide-react'
import { useProductsQuery } from '@/app/tanstack-queries/productsQuery'
import type { ProductFormData } from '../types'

interface FormSectionPairsWithProps {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) => void
  /** En edición se excluye el propio producto de la lista. */
  currentProductId?: number | null
}

/**
 * "Combina con" (Pairs With): mismo patrón que el selector de las landing
 * sections — botón "Agregar productos" abre una modal con buscador y cards
 * con botón Agregar; lo elegido queda como chips con foto que se quitan con la X.
 * Se guardan como JSON array de IDs en el campo pairsWith.
 */
export default function FormSectionPairsWith({
  formData,
  updateField,
  currentProductId,
}: FormSectionPairsWithProps) {
  const { data, isLoading } = useProductsQuery({ limit: 100 })
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')

  const products = useMemo(
    () => (data?.data ?? []).filter((p) => p.id !== currentProductId),
    [data, currentProductId],
  )

  const selected = products.filter((p) => formData.pairsWith.includes(p.id))
  const available = products.filter((p) => !formData.pairsWith.includes(p.id))
  const visible = query.trim()
    ? available.filter((p) =>
        p.name.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : available

  const add = (id: number) => updateField('pairsWith', [...formData.pairsWith, id])
  const remove = (id: number) =>
    updateField('pairsWith', formData.pairsWith.filter((p) => p !== id))

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text">Combina con</h3>
          <p className="mt-1 text-xs text-text-muted">
            Productos que se recomiendan en la ficha (mini carrusel "Combina con"
            bajo los detalles). Agrégalos desde la modal, igual que en las
            secciones del home.
          </p>
        </div>
        <Button
          size="sm"
          color="warning"
          variant="flat"
          startContent={<Plus size={14} />}
          onPress={() => setIsOpen(true)}
        >
          Agregar productos
        </Button>
      </div>

      {selected.length === 0 ? (
        <p className="text-sm text-text-muted">
          Ningún producto elegido todavía.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selected.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-2"
            >
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt=""
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <span className="h-6 w-6 rounded-full bg-bg-alt" />
              )}
              <span className="text-xs text-text">{p.name}</span>
              <button
                type="button"
                aria-label={`Quitar ${p.name}`}
                onClick={() => remove(p.id)}
                className="text-text-muted transition-colors hover:text-danger"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Modal buscador — mismo patrón que "Gestionar productos" de landing */}
      <Modal isOpen={isOpen} onOpenChange={setIsOpen} size="2xl" scrollBehavior="inside">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-border">
                <span className="font-heading text-xl font-bold text-text">
                  Agregar a "Combina con"
                </span>
                <span className="text-sm font-normal text-text-muted">
                  Busca el producto y pulsa Agregar; se suma a las etiquetas.
                </span>
              </ModalHeader>
              <ModalBody className="pb-6">
                <Input
                  placeholder="Buscar productos por nombre..."
                  value={query}
                  onValueChange={setQuery}
                  isClearable
                  onClear={() => setQuery('')}
                  className="mb-3"
                  size="sm"
                  startContent={<Search size={14} className="text-text-muted" />}
                  classNames={{
                    input: 'text-text',
                    inputWrapper: 'border-border',
                  }}
                />

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" color="warning" />
                  </div>
                ) : visible.length === 0 ? (
                  <p className="py-4 text-sm text-text-muted">
                    {query
                      ? 'No se encontraron productos.'
                      : 'Todos los productos ya están en "Combina con".'}
                  </p>
                ) : (
                  <div className="grid max-h-96 grid-cols-1 gap-2 overflow-y-auto pr-2 sm:grid-cols-2">
                    {visible.map((product) => (
                      <Card key={product.id} shadow="sm" className="border border-border">
                        <CardBody className="flex flex-row items-center justify-between gap-2 p-3">
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="h-12 w-12 rounded border border-border object-cover"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-text">
                                {product.name}
                              </p>
                              <p className="text-xs text-text-muted">
                                ${product.price}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            color="primary"
                            variant="flat"
                            onPress={() => add(product.id)}
                          >
                            Agregar
                          </Button>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}
