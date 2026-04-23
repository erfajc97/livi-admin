import { useState } from 'react';
import { useLandingSectionsQuery } from './useLandingSectionsQuery';
import {
  useCreateLandingSectionMutation,
  useUpdateLandingSectionMutation,
  useDeleteLandingSectionMutation,
} from '../mutations/landingSectionsMutations';
import type { LandingSection, CreateLandingSectionDto, UpdateLandingSectionDto } from '../types';

export function useLandingSectionsLogic() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState<LandingSection | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<number | null>(null);

  const { data: sections = [], isLoading } = useLandingSectionsQuery();
  const createMutation = useCreateLandingSectionMutation();
  const updateMutation = useUpdateLandingSectionMutation();
  const deleteMutation = useDeleteLandingSectionMutation();

  const handleCreate = () => {
    setSelectedSection(null);
    setIsModalOpen(true);
  };

  const handleEdit = (section: LandingSection) => {
    setSelectedSection(section);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSection(null);
  };

  const handleSubmit = async (dto: CreateLandingSectionDto | UpdateLandingSectionDto) => {
    if (selectedSection) {
      await updateMutation.mutateAsync({ id: selectedSection.id, dto });
    } else {
      await createMutation.mutateAsync(dto as CreateLandingSectionDto);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: number) => {
    setSectionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (sectionToDelete !== null) {
      await deleteMutation.mutateAsync(sectionToDelete);
      setIsDeleteDialogOpen(false);
      setSectionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSectionToDelete(null);
  };

  return {
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
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
