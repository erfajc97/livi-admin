import { Input, Textarea, Button, Chip } from '@heroui/react'
import { Plus, Trash2, Upload } from 'lucide-react'
import { CARACTER_OPTIONS, OCASION_OPTIONS, SCENT_COLOR_PRESETS } from '../data'
import type { ProductFormData, ScentSection } from '../types'

interface Props {
  formData: ProductFormData
  updateField: <K extends keyof ProductFormData>(
    key: K,
    value: ProductFormData[K],
  ) => void
}

const inputCls = { label: '!text-text', input: '!text-text' }

export default function FormSectionEditorial({ formData, updateField }: Props) {
  const sections = formData.scentSections
  const setSections = (s: ScentSection[]) => updateField('scentSections', s)

  const addSection = () =>
    setSections([
      ...sections,
      { title: '', notes: [{ name: '', color: '#C9A87A' }], description: '' },
    ])
  const updateSection = (i: number, patch: Partial<ScentSection>) =>
    setSections(sections.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))
  const removeSection = (i: number) =>
    setSections(sections.filter((_, idx) => idx !== i))
  const addNote = (i: number) =>
    updateSection(i, {
      notes: [...sections[i].notes, { name: '', color: '#C9A87A' }],
    })
  const updateNote = (
    i: number,
    j: number,
    patch: Partial<{ name: string; color: string }>,
  ) =>
    updateSection(i, {
      notes: sections[i].notes.map((n, idx) =>
        idx === j ? { ...n, ...patch } : n,
      ),
    })
  const removeNote = (i: number, j: number) =>
    updateSection(i, { notes: sections[i].notes.filter((_, idx) => idx !== j) })

  const toggle = (key: 'mood' | 'occasion', v: string) => {
    const arr = formData[key]
    updateField(key, arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])
  }

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-5">
      <h3 className="text-sm font-medium uppercase text-text-muted">
        PDP — Editorial
      </h3>

      {/* ── Perfil olfativo ── */}
      <div className="flex flex-col gap-4 rounded-lg border border-default-200 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-text">Perfil olfativo</p>
          <Button
            size="sm"
            variant="flat"
            color="primary"
            startContent={<Plus size={16} />}
            onPress={addSection}
          >
            Agregar sección
          </Button>
        </div>

        <Input
          label="Título del perfil (ej. La pirámide de Layton)"
          value={formData.scentProfileTitle}
          onValueChange={(v) => updateField('scentProfileTitle', v)}
          classNames={inputCls}
        />

        {sections.length === 0 && (
          <p className="text-xs text-default-400">
            Sin secciones. Agrega hasta 3 (salida / corazón / fondo).
          </p>
        )}

        {sections.map((sec, i) => (
          <div
            key={i}
            className="rounded-lg border border-default-200 bg-bg p-3"
          >
            <div className="mb-3 flex items-center gap-2">
              <Chip size="sm" variant="flat">
                Sección {i + 1}
              </Chip>
              <div className="flex-1" />
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onPress={() => removeSection(i)}
              >
                <Trash2 size={16} />
              </Button>
            </div>

            <Input
              label="Título (ej. Notas de salida)"
              value={sec.title}
              onValueChange={(v) => updateSection(i, { title: v })}
              classNames={inputCls}
              className="mb-3"
            />

            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase text-text-muted">
                Notas (color + nombre)
              </span>
              <Button
                size="sm"
                variant="flat"
                startContent={<Plus size={14} />}
                onPress={() => addNote(i)}
              >
                Nota
              </Button>
            </div>

            <div className="mb-3 flex flex-col gap-2">
              {sec.notes.map((note, j) => (
                <div key={j} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={note.color}
                    onChange={(e) =>
                      updateNote(i, j, { color: e.target.value })
                    }
                    className="h-9 w-10 shrink-0 cursor-pointer rounded border border-default-200 bg-transparent"
                    title="Color de la nota"
                  />
                  <div className="flex shrink-0 gap-1">
                    {SCENT_COLOR_PRESETS.slice(0, 5).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updateNote(i, j, { color: c })}
                        className="h-5 w-5 rounded-full border border-default-200"
                        style={{ background: c }}
                        title={c}
                      />
                    ))}
                  </div>
                  <Input
                    size="sm"
                    placeholder="Nombre de la nota (ej. Bergamota)"
                    value={note.name}
                    onValueChange={(v) => updateNote(i, j, { name: v })}
                    classNames={inputCls}
                  />
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => removeNote(i, j)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>

            <Textarea
              label="Descripción"
              value={sec.description}
              onValueChange={(v) => updateSection(i, { description: v })}
              classNames={inputCls}
              minRows={2}
            />
          </div>
        ))}
      </div>

      {/* ── Carácter / Ocasión ── */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-default-200 p-4">
          <p className="mb-3 text-sm font-semibold text-text">Carácter</p>
          <div className="flex flex-wrap gap-2">
            {CARACTER_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggle('mood', opt)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  formData.mood.includes(opt)
                    ? 'border-primary bg-primary text-white'
                    : 'border-default-200 text-text hover:border-primary'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-default-200 p-4">
          <p className="mb-3 text-sm font-semibold text-text">Ocasión</p>
          <div className="flex flex-wrap gap-2">
            {OCASION_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggle('occasion', opt)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  formData.occasion.includes(opt)
                    ? 'border-primary bg-primary text-white'
                    : 'border-default-200 text-text hover:border-primary'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Longevidad / Proyección (0-10) ── */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          min={0}
          max={10}
          label="Longevidad (0–10)"
          value={formData.longevity}
          onValueChange={(v) => updateField('longevity', v)}
          classNames={inputCls}
        />
        <Input
          type="number"
          min={0}
          max={10}
          label="Proyección (0–10)"
          value={formData.projectionScore}
          onValueChange={(v) => updateField('projectionScore', v)}
          classNames={inputCls}
        />
      </div>

      {/* ── La firma ── */}
      <div className="flex flex-col gap-3 rounded-lg border border-default-200 p-4">
        <p className="text-sm font-semibold text-text">La firma</p>
        <Input
          label="Título"
          value={formData.signatureTitle}
          onValueChange={(v) => updateField('signatureTitle', v)}
          classNames={inputCls}
        />
        <Textarea
          label="Descripción"
          value={formData.signatureDescription}
          onValueChange={(v) => updateField('signatureDescription', v)}
          classNames={inputCls}
          minRows={3}
        />
        {/* Imagen de la firma — subir archivo (o pegar URL) */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-text">Imagen de la firma</span>
          <div className="flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-default-200 bg-bg px-4 py-2 text-sm text-text hover:bg-surface">
              <Upload size={16} />
              <span>
                {formData.signatureImageFile
                  ? 'Cambiar archivo'
                  : 'Subir imagen'}
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  updateField('signatureImageFile', e.target.files?.[0] ?? null)
                }
              />
            </label>
            {(formData.signatureImageFile || formData.signatureImageUrl) && (
              <Button
                size="sm"
                variant="flat"
                color="danger"
                onPress={() => {
                  updateField('signatureImageFile', null)
                  updateField('signatureImageUrl', '')
                }}
              >
                Quitar
              </Button>
            )}
          </div>
          <Input
            label="o pega una URL"
            placeholder="https://…"
            value={formData.signatureImageUrl}
            onValueChange={(v) => updateField('signatureImageUrl', v)}
            classNames={inputCls}
          />
          {(formData.signatureImageFile || formData.signatureImageUrl) && (
            <img
              src={
                formData.signatureImageFile
                  ? URL.createObjectURL(formData.signatureImageFile)
                  : formData.signatureImageUrl
              }
              alt="Firma"
              className="h-32 w-full rounded-lg object-cover"
            />
          )}
        </div>
      </div>
    </div>
  )
}
