import { useState } from 'react'
import { Button, Spinner, useDisclosure } from '@heroui/react'
import { SectionCard } from '../components/SectionCard'
import { SectionFormModal } from '../components/SectionFormModal'
import { ProductsManagementModal } from '../components/ProductsManagementModal'
import { useLandingSectionsLogic } from '../hooks/useLandingSectionsLogic'
import type { LandingSection } from '../types'

export default function LandingSectionsPage() {
  const {
    sections,
    isLoading,
    isModalOpen,
    selectedSection,
    isDeleteDialogOpen,
    handleCreate,
    handleEdit,
    handleCloseModal,
    handleSubmit,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    isSubmitting,
    isDeleting,
  } = useLandingSectionsLogic()

  const [productsSectionId, setProductsSectionId] = useState<number | null>(
    null,
  )
  const {
    isOpen: isProductsModalOpen,
    onOpen: onProductsModalOpen,
    onOpenChange: onProductsModalOpenChange,
  } = useDisclosure()

  // El límite de 2 secciones aplica solo a la landing (2 huecos: arriba y
  // debajo de testimonios). Las secciones del carrito no tienen tope: si el
  // botón dependía del total, con 2 de home ya no se podía crear la del
  // carrito y la publicidad del carrito quedaba inaccesible.
  const homeSections = Array.isArray(sections)
    ? sections.filter((s) => s.placement !== 'cart')
    : []
  const homeFull = homeSections.length >= 2

  // Siempre leer la sección fresca de la query para que se actualice al agregar/quitar productos
  const productsSection = Array.isArray(sections)
    ? (sections.find((s) => s.id === productsSectionId) ?? null)
    : null

  const handleManageProducts = (section: LandingSection) => {
    setProductsSectionId(section.id)
    onProductsModalOpen()
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">
            Secciones de Landing
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Gestiona las secciones de la página principal
          </p>
        </div>
        <Button color="primary" onPress={handleCreate}>
          Nueva Sección
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Spinner size="lg" color="warning" />
        </div>
      ) : sections.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-muted mb-4">No hay secciones creadas.</p>
          <Button color="primary" onPress={handleCreate}>
            Crear Primera Sección
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.isArray(sections) &&
            sections
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                  onManageProducts={handleManageProducts}
                />
              ))}
        </div>
      )}

      {/* Modals */}
      <SectionFormModal
        isOpen={isModalOpen}
        onOpenChange={handleCloseModal}
        section={selectedSection}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        homeFull={homeFull}
      />

      <ProductsManagementModal
        isOpen={isProductsModalOpen}
        onOpenChange={onProductsModalOpenChange}
        section={productsSection}
      />

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 max-w-md mx-4 border border-border">
            <h3 className="font-heading text-lg font-bold text-text mb-2">
              Confirmar eliminación
            </h3>
            <p className="text-text-muted mb-6">
              ¿Estás seguro de que deseas eliminar esta sección? Esta acción no
              se puede deshacer.
            </p>
            <div className="flex gap-2 justify-end">
              <Button
                color="default"
                variant="flat"
                onPress={handleCancelDelete}
                isDisabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                color="danger"
                onPress={handleConfirmDelete}
                isLoading={isDeleting}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
