import { useEffect, useState } from 'react'
import { Spinner, addToast } from '@heroui/react'
import { useQueryClient } from '@tanstack/react-query'
import { useComboFormHook } from '../hooks/useComboFormHook'
import { useComboByIdQuery } from '@/app/tanstack-queries/combosQuery'
import { combosService } from '../services/combosService'
import ComboForm from './ComboForm'
import ComboVersionsEditor from './ComboVersionsEditor'
import type { Combo } from '../types'

interface ComboFormViewProps {
  combo: Combo | null
  onBack: () => void
}

export default function ComboFormView({ combo, onBack }: ComboFormViewProps) {
  const isEdit = !!combo
  const queryClient = useQueryClient()
  const [isSaving, setIsSaving] = useState(false)
  const {
    formData,
    productRows,
    versions,
    updateField,
    resetForm,
    loadCombo,
    addProductRow,
    updateProductRow,
    removeProductRow,
    addVersion,
    removeVersion,
    updateVersionField,
    addVersionProductRow,
    updateVersionProductRow,
    removeVersionProductRow,
    buildPayload,
    buildVersionOps,
    handleImageChange,
  } = useComboFormHook()

  const { data: fullCombo, isLoading } = useComboByIdQuery(
    combo?.id ?? 0,
    isEdit,
  )

  useEffect(() => {
    if (fullCombo) loadCombo(fullCombo)
  }, [fullCombo, loadCombo])

  useEffect(() => {
    if (!isEdit) resetForm()
  }, [isEdit, resetForm])

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      const basePayload = { ...buildPayload(), imageFile: formData.imageFile }
      const base =
        isEdit && combo
          ? await combosService.updateCombo(combo.id, basePayload)
          : await combosService.createCombo(basePayload)

      // Versiones: crear/actualizar/eliminar tras tener el id del combo base.
      const ops = buildVersionOps(formData.name, base.id)
      await Promise.all([
        ...ops.toDelete.map((id) => combosService.deleteCombo(id)),
        ...ops.toUpdate.map((u) => combosService.updateCombo(u.id, u.payload)),
        ...ops.toCreate.map((p) => combosService.createCombo(p)),
      ])

      queryClient.invalidateQueries({ queryKey: ['combos'] })
      addToast({
        title: isEdit ? 'Combo actualizado' : 'Combo creado',
        color: 'success',
      })
      onBack()
    } catch (e) {
      addToast({
        title: (e as Error)?.message ?? 'Error al guardar el combo',
        color: 'danger',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" color="warning" />
      </div>
    )
  }

  return (
    <ComboForm
      formData={formData}
      productRows={productRows}
      updateField={updateField}
      addProductRow={addProductRow}
      updateProductRow={updateProductRow}
      removeProductRow={removeProductRow}
      onImageChange={handleImageChange}
      onSubmit={handleSubmit}
      onBack={onBack}
      isSubmitting={isSaving}
      isEdit={isEdit}
    >
      <ComboVersionsEditor
        versions={versions}
        addVersion={addVersion}
        removeVersion={removeVersion}
        updateVersionField={updateVersionField}
        addVersionProductRow={addVersionProductRow}
        updateVersionProductRow={updateVersionProductRow}
        removeVersionProductRow={removeVersionProductRow}
      />
    </ComboForm>
  )
}
