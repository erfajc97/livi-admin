import { useState, useMemo } from 'react'
import { Autocomplete, AutocompleteItem, Button, Input, Tabs, Tab } from '@heroui/react'
import { Search, X } from 'lucide-react'
import type {
  ClientMode,
  ManualSaleClient,
  ManualSaleCustomerForm,
} from '../types'

interface ClientSelectorProps {
  mode: ClientMode
  onModeChange: (mode: ClientMode) => void
  users: ManualSaleClient[]
  selectedClient: ManualSaleClient | null
  onSelect: (client: ManualSaleClient | null) => void
  customer: ManualSaleCustomerForm
  onCustomerChange: (field: keyof ManualSaleCustomerForm, value: string) => void
  /** Con guía de Servientrega la dirección deja de ser opcional. */
  requiresAddress: boolean
}

const inputClassNames = { input: '!text-text', label: '!text-text-muted' }

export default function ClientSelector({
  mode,
  onModeChange,
  users,
  selectedClient,
  onSelect,
  customer,
  onCustomerChange,
  requiresAddress,
}: ClientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users.slice(0, 50)
    const lower = searchTerm.toLowerCase()
    return users
      .filter(
        (u) =>
          u.firstName.toLowerCase().includes(lower) ||
          u.lastName.toLowerCase().includes(lower) ||
          u.email.toLowerCase().includes(lower),
      )
      .slice(0, 50)
  }, [users, searchTerm])

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
      <h3 className="text-base font-semibold text-text">Cliente</h3>

      <Tabs
        selectedKey={mode}
        onSelectionChange={(key) => onModeChange(key as ClientMode)}
        color="warning"
        variant="solid"
        size="sm"
        classNames={{
          tabList: 'bg-bg',
          tab: 'data-[selected=true]:bg-accent data-[selected=true]:text-bg',
          tabContent: 'text-text',
        }}
      >
        <Tab key="new" title="Cliente nuevo">
          <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2">
            <Input
              label="Nombre"
              isRequired
              value={customer.firstName}
              onValueChange={(v) => onCustomerChange('firstName', v)}
              classNames={inputClassNames}
              size="sm"
            />
            <Input
              label="Apellido"
              value={customer.lastName}
              onValueChange={(v) => onCustomerChange('lastName', v)}
              classNames={inputClassNames}
              size="sm"
            />
            <Input
              label="Correo"
              type="email"
              isRequired
              description="Ahí llega la confirmación de compra y el tracking"
              value={customer.email}
              onValueChange={(v) => onCustomerChange('email', v)}
              classNames={inputClassNames}
              size="sm"
            />
            <Input
              label="Teléfono"
              value={customer.phone}
              onValueChange={(v) => onCustomerChange('phone', v)}
              classNames={inputClassNames}
              size="sm"
            />
            <Input
              label="Cédula"
              value={customer.cedula}
              onValueChange={(v) => onCustomerChange('cedula', v)}
              classNames={inputClassNames}
              size="sm"
            />
            <Input
              label="Ciudad"
              isRequired={requiresAddress}
              value={customer.city}
              onValueChange={(v) => onCustomerChange('city', v)}
              classNames={inputClassNames}
              size="sm"
            />
            <Input
              label="Provincia"
              value={customer.province}
              onValueChange={(v) => onCustomerChange('province', v)}
              classNames={inputClassNames}
              size="sm"
            />
            <Input
              label="Dirección"
              isRequired={requiresAddress}
              value={customer.address}
              onValueChange={(v) => onCustomerChange('address', v)}
              classNames={inputClassNames}
              size="sm"
            />
            <p className="text-xs text-text-muted sm:col-span-2">
              Si el correo ya tiene cuenta se reutiliza esa; si no, se crea y se
              le envían sus datos de acceso.
            </p>
          </div>
        </Tab>

        <Tab key="existing" title="Cliente registrado">
          <div className="pt-4">
            {selectedClient ? (
              <div className="flex items-center gap-3 rounded-lg bg-bg p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-bg font-bold shrink-0">
                  {selectedClient.firstName[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text">
                    {selectedClient.firstName} {selectedClient.lastName}
                  </p>
                  <p className="text-xs text-text-muted">
                    {selectedClient.email}
                  </p>
                </div>
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  onPress={() => onSelect(null)}
                >
                  <X size={14} />
                </Button>
              </div>
            ) : (
              <Autocomplete
                placeholder="Buscar cliente por nombre o email"
                startContent={<Search size={18} className="text-text-muted" />}
                inputValue={searchTerm}
                onInputChange={setSearchTerm}
                items={filteredUsers}
                onSelectionChange={(key) => {
                  if (!key) return
                  const user = users.find((u) => String(u.id) === String(key))
                  if (user) {
                    onSelect(user)
                    setSearchTerm('')
                  }
                }}
                defaultFilter={() => true}
                inputProps={{
                  classNames: { label: '!text-text', input: '!text-text' },
                }}
                listboxProps={{
                  className: 'bg-surface text-text max-h-64 overflow-y-auto',
                }}
                popoverProps={{
                  classNames: { content: 'bg-surface border border-border' },
                }}
              >
                {(user) => (
                  <AutocompleteItem
                    key={String(user.id)}
                    textValue={`${user.firstName} ${user.lastName}`}
                    classNames={{
                      base: 'text-text data-[hover=true]:bg-bg',
                      title: '!text-text',
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-text">
                        {user.firstName} {user.lastName}
                      </span>
                      <span className="text-xs text-text-muted">
                        {user.email}
                      </span>
                    </div>
                  </AutocompleteItem>
                )}
              </Autocomplete>
            )}
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}
