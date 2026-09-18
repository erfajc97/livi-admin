import { Button, Input, Chip } from '@heroui/react'
import { Plus, Trash2 } from 'lucide-react'
import ComboProductRowVariations from './ComboProductRowVariations'
import type { VersionDraft } from '../hooks/useComboFormHook'
import type { ComboProductRow } from '../types'

interface ComboVersionsEditorProps {
  versions: VersionDraft[]
  addVersion: () => void
  removeVersion: (index: number) => void
  updateVersionField: (
    index: number,
    field: 'finalPrice' | 'discount',
    value: string,
  ) => void
  addVersionProductRow: (vIndex: number) => void
  updateVersionProductRow: (
    vIndex: number,
    rIndex: number,
    field: keyof ComboProductRow,
    value: string,
  ) => void
  removeVersionProductRow: (vIndex: number, rIndex: number) => void
}

export default function ComboVersionsEditor({
  versions,
  addVersion,
  removeVersion,
  updateVersionField,
  addVersionProductRow,
  updateVersionProductRow,
  removeVersionProductRow,
}: ComboVersionsEditorProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium uppercase text-text-muted">
            Versiones del combo
          </h3>
          <p className="text-xs text-text-muted/80">
            Mismo nombre, otros productos y otro precio (p. ej. una variante con
            productos más caros). El cliente elige una u otra en la web.
          </p>
        </div>
        <Button
          size="sm"
          variant="flat"
          color="primary"
          startContent={<Plus size={16} />}
          onPress={addVersion}
        >
          Agregar versión
        </Button>
      </div>

      {versions.length === 0 ? (
        <p className="py-3 text-center text-sm text-text-muted">
          Sin versiones. Este combo se vende como uno solo.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {versions.map((v, vIndex) => (
            <div
              key={v.id ?? `new-${vIndex}`}
              className="rounded-lg border border-border bg-bg-alt p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <Chip size="sm" variant="flat">
                  Versión {vIndex + 2}
                </Chip>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="danger"
                  onPress={() => removeVersion(vIndex)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4">
                <Input
                  label="Precio final ($)"
                  type="number"
                  value={v.finalPrice}
                  onValueChange={(val) =>
                    updateVersionField(vIndex, 'finalPrice', val)
                  }
                  classNames={{ label: '!text-text', input: '!text-text' }}
                />
                <Input
                  label="Descuento ($)"
                  type="number"
                  placeholder="Opcional"
                  value={v.discount}
                  onValueChange={(val) =>
                    updateVersionField(vIndex, 'discount', val)
                  }
                  classNames={{ label: '!text-text', input: '!text-text' }}
                />
              </div>

              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium uppercase text-text-muted">
                  Productos de esta versión
                </span>
                <Button
                  size="sm"
                  variant="flat"
                  startContent={<Plus size={14} />}
                  onPress={() => addVersionProductRow(vIndex)}
                >
                  Agregar
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                {v.productRows.map((row, rIndex) => (
                  <ComboProductRowVariations
                    key={rIndex}
                    row={row}
                    index={rIndex}
                    updateProductRow={(ri, field, value) =>
                      updateVersionProductRow(vIndex, ri, field, value)
                    }
                    removeProductRow={(ri) =>
                      removeVersionProductRow(vIndex, ri)
                    }
                    canRemove={v.productRows.length > 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
