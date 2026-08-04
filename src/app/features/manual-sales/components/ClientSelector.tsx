import { useState, useMemo } from 'react'
import { Autocomplete, AutocompleteItem, Button } from '@heroui/react'
import { Search, X } from 'lucide-react'
import type { ManualSaleClient } from '../types'

interface ClientSelectorProps {
  users: ManualSaleClient[]
  selectedClient: ManualSaleClient | null
  onSelect: (client: ManualSaleClient | null) => void
}

export default function ClientSelector({
  users,
  selectedClient,
  onSelect,
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

      {selectedClient ? (
        <div className="flex items-center gap-3 rounded-lg bg-bg p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-bg font-bold shrink-0">
            {selectedClient.firstName[0]}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text">
              {selectedClient.firstName} {selectedClient.lastName}
            </p>
            <p className="text-xs text-text-muted">{selectedClient.email}</p>
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
                <span className="text-xs text-text-muted">{user.email}</span>
              </div>
            </AutocompleteItem>
          )}
        </Autocomplete>
      )}
    </div>
  )
}
