import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Switch,
  Select,
  SelectItem,
} from '@heroui/react';
import { useState, useEffect } from 'react';
import type { LandingSection, CreateLandingSectionDto, UpdateLandingSectionDto } from '../types';

interface SectionFormModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  section: LandingSection | null;
  onSubmit: (dto: CreateLandingSectionDto | UpdateLandingSectionDto) => Promise<void>;
  isSubmitting: boolean;
}

export function SectionFormModal({
  isOpen,
  onOpenChange,
  section,
  onSubmit,
  isSubmitting,
}: SectionFormModalProps) {
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState('1');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (section) {
      setTitle(section.title);
      setOrder(String(section.order));
      setIsActive(section.isActive);
    } else {
      setTitle('');
      setOrder('1');
      setIsActive(true);
    }
  }, [section]);

  const handleSubmit = async () => {
    const dto = {
      title,
      order: parseInt(order, 10),
      isActive,
    };
    await onSubmit(dto);
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 border-b border-border">
              <span className="font-heading text-xl font-bold text-text">
                {section ? 'Editar Sección' : 'Nueva Sección'}
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-4">
                <Input
                  label="Título"
                  placeholder="Ej: ÚLTIMOS INGRESOS"
                  value={title}
                  onValueChange={setTitle}
                  isRequired
                  classNames={{
                    label: 'text-sm font-medium text-text',
                    input: 'text-sm text-text',
                    inputWrapper: 'border-border',
                  }}
                />

                <Select
                  label="Posición en la landing"
                  selectedKeys={[order]}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0] as string;
                    if (val) setOrder(val);
                  }}
                  isRequired
                  classNames={{
                    label: 'text-sm font-medium text-text',
                    value: 'text-sm text-text',
                    trigger: 'border-border',
                  }}
                >
                  <SelectItem key="1">Arriba de testimonios</SelectItem>
                  <SelectItem key="2">Debajo de testimonios</SelectItem>
                </Select>

                <div className="flex items-center gap-2">
                  <Switch
                    isSelected={isActive}
                    onValueChange={setIsActive}
                    size="sm"
                  >
                    <span className="text-sm text-text">Sección activa</span>
                  </Switch>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                isDisabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!title.trim() || !order}
              >
                {section ? 'Actualizar' : 'Crear'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
