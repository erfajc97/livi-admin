import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { landingSectionsService } from '../services/landingSectionsService';
import type { CreateLandingSectionDto, UpdateLandingSectionDto } from '../types';
import { LANDING_SECTIONS_QUERY_KEY } from '../hooks/useLandingSectionsQuery';

export function useCreateLandingSectionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateLandingSectionDto) => landingSectionsService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LANDING_SECTIONS_QUERY_KEY] });
      toast.success('Sección creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al crear la sección');
    },
  });
}

export function useUpdateLandingSectionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateLandingSectionDto }) =>
      landingSectionsService.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LANDING_SECTIONS_QUERY_KEY] });
      toast.success('Sección actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar la sección');
    },
  });
}

export function useDeleteLandingSectionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => landingSectionsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LANDING_SECTIONS_QUERY_KEY] });
      toast.success('Sección eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al eliminar la sección');
    },
  });
}

export function useAddProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, productId }: { sectionId: number; productId: number }) =>
      landingSectionsService.addProduct(sectionId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LANDING_SECTIONS_QUERY_KEY] });
      toast.success('Producto agregado a la sección');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al agregar el producto');
    },
  });
}

export function useRemoveProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId, productId }: { sectionId: number; productId: number }) =>
      landingSectionsService.removeProduct(sectionId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [LANDING_SECTIONS_QUERY_KEY] });
      toast.success('Producto removido de la sección');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al remover el producto');
    },
  });
}
