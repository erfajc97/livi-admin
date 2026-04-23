import { Card, CardBody, CardHeader, Button, Chip } from '@heroui/react';
import type { LandingSection } from '../types';

interface SectionCardProps {
  section: LandingSection;
  onEdit: (section: LandingSection) => void;
  onDelete: (id: number) => void;
  onManageProducts: (section: LandingSection) => void;
}

export function SectionCard({
  section,
  onEdit,
  onDelete,
  onManageProducts,
}: SectionCardProps) {
  return (
    <Card shadow="sm" className="border border-border">
      <CardHeader className="flex justify-between items-start px-4 pt-4 pb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-lg font-bold text-text">{section.title}</h3>
            <Chip size="sm" color={section.isActive ? 'success' : 'default'} variant="flat">
              {section.isActive ? 'Activa' : 'Inactiva'}
            </Chip>
          </div>
          <p className="text-sm text-text-muted">
            {section.order <= 1 ? 'Arriba de testimonios' : 'Debajo de testimonios'}
          </p>
        </div>
      </CardHeader>

      <CardBody className="px-4 pb-4">
        <div className="mb-3">
          <p className="text-sm text-text-muted mb-2">
            <span className="font-semibold text-accent">{section.products.length}</span> producto(s)
          </p>

          {section.products.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {section.products.slice(0, 3).map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-2 bg-surface-raised rounded-md px-2 py-1"
                >
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-6 h-6 object-cover rounded"
                    />
                  )}
                  <span className="text-xs text-text truncate max-w-[120px]">
                    {product.name}
                  </span>
                </div>
              ))}
              {section.products.length > 3 && (
                <Chip size="sm" variant="flat">
                  +{section.products.length - 3}
                </Chip>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            color="primary"
            variant="flat"
            onPress={() => onManageProducts(section)}
          >
            Gestionar Productos
          </Button>
          <Button
            size="sm"
            color="default"
            variant="flat"
            onPress={() => onEdit(section)}
          >
            Editar
          </Button>
          <Button
            size="sm"
            color="danger"
            variant="flat"
            onPress={() => onDelete(section.id)}
          >
            Eliminar
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
