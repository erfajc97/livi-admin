import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  Input,
  Spinner,
  Card,
  CardBody,
} from '@heroui/react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSectionProductsHook } from '../hooks/useSectionProductsHook'
import { SortableSectionProduct } from './SortableSectionProduct'
import type { LandingSection } from '../types'

interface ProductsManagementModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  section: LandingSection | null
}

export function ProductsManagementModal({
  isOpen,
  onOpenChange,
  section,
}: ProductsManagementModalProps) {
  const {
    searchTerm,
    setSearchTerm,
    sectionProducts,
    filteredProductsToAdd,
    isLoadingProducts,
    handleAddProduct,
    handleRemoveProduct,
    handleDragEnd,
    isAddingProduct,
    isRemovingProduct,
  } = useSectionProductsHook(section, isOpen)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-border">
              <span className="font-heading text-xl font-bold text-text">
                Gestionar Productos
              </span>
              <span className="text-sm text-text-muted font-normal">
                {section?.title}
              </span>
            </ModalHeader>
            <ModalBody className="pb-6">
              <div className="mb-6">
                <h3 className="mb-1 font-heading text-base font-bold text-text">
                  Productos en la sección ({sectionProducts.length})
                </h3>
                <p className="mb-3 text-xs text-text-muted">
                  Arrastra el asidero para definir el orden. El primero es el que
                  se destaca en el home.
                </p>
                {sectionProducts.length === 0 ? (
                  <p className="text-sm text-text-muted">
                    No hay productos en esta sección.
                  </p>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={sectionProducts.map((p) => String(p.id))}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex flex-col gap-2">
                        {sectionProducts.map((product) => (
                          <SortableSectionProduct
                            key={product.id}
                            product={product}
                            onRemove={handleRemoveProduct}
                            isRemoving={isRemovingProduct}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>

              <div>
                <h3 className="mb-3 font-heading text-base font-bold text-text">
                  Agregar productos
                </h3>
                <Input
                  placeholder="Buscar productos por nombre o marca..."
                  value={searchTerm}
                  onValueChange={setSearchTerm}
                  isClearable
                  onClear={() => setSearchTerm('')}
                  className="mb-3"
                  size="sm"
                  classNames={{
                    input: 'text-text',
                    inputWrapper: 'border-border',
                  }}
                />

                {isLoadingProducts ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="lg" color="warning" />
                  </div>
                ) : filteredProductsToAdd.length === 0 ? (
                  <p className="py-4 text-sm text-text-muted">
                    {searchTerm
                      ? 'No se encontraron productos.'
                      : 'Todos los productos están en la sección.'}
                  </p>
                ) : (
                  <div className="grid max-h-96 grid-cols-1 gap-2 overflow-y-auto pr-2 sm:grid-cols-2">
                    {filteredProductsToAdd.map((product) => (
                      <Card
                        key={product.id}
                        shadow="sm"
                        className="border border-border"
                      >
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
                            onPress={() => handleAddProduct(product.id)}
                            isLoading={isAddingProduct}
                          >
                            Agregar
                          </Button>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
