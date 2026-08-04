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
import { useSectionProductsHook } from '../hooks/useSectionProductsHook'
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
    isAddingProduct,
    isRemovingProduct,
  } = useSectionProductsHook(section, isOpen)

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
              {/* Productos actuales en la sección */}
              <div className="mb-6">
                <h3 className="font-heading text-base font-bold text-text mb-3">
                  Productos en la sección ({sectionProducts.length})
                </h3>
                {sectionProducts.length === 0 ? (
                  <p className="text-sm text-text-muted">
                    No hay productos en esta sección.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sectionProducts.map((product) => (
                      <Card
                        key={product.id}
                        shadow="sm"
                        className="border border-border"
                      >
                        <CardBody className="flex flex-row items-center justify-between gap-2 p-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded border border-border"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-text-muted">
                                ${product.price}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            color="danger"
                            variant="flat"
                            onPress={() => handleRemoveProduct(product.id)}
                            isLoading={isRemovingProduct}
                          >
                            Quitar
                          </Button>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Agregar productos */}
              <div>
                <h3 className="font-heading text-base font-bold text-text mb-3">
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
                  <p className="text-sm text-text-muted py-4">
                    {searchTerm
                      ? 'No se encontraron productos.'
                      : 'Todos los productos están en la sección.'}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
                    {filteredProductsToAdd.map((product) => (
                      <Card
                        key={product.id}
                        shadow="sm"
                        className="border border-border"
                      >
                        <CardBody className="flex flex-row items-center justify-between gap-2 p-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded border border-border"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-text truncate">
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
