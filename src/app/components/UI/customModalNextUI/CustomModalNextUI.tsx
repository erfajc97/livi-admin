import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react'

interface CustomModalNextUIProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  headerContent?: React.ReactNode
  footerContent?: React.ReactNode
  children: React.ReactNode
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | 'full'
  placement?:
    | 'center'
    | 'auto'
    | 'top'
    | 'top-center'
    | 'bottom'
    | 'bottom-center'
  isDismissable?: boolean
  hideCloseButton?: boolean
  scrollBehavior?: 'normal' | 'inside' | 'outside'
  classNames?: Partial<
    Record<
      | 'wrapper'
      | 'base'
      | 'backdrop'
      | 'header'
      | 'body'
      | 'footer'
      | 'closeButton',
      string
    >
  >
}

export function CustomModalNextUI({
  isOpen,
  onOpenChange,
  headerContent,
  footerContent,
  children,
  size = 'md',
  placement = 'center',
  isDismissable = true,
  hideCloseButton,
  scrollBehavior,
  classNames: externalClassNames,
}: CustomModalNextUIProps) {
  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size={size}
      placement={placement}
      isDismissable={isDismissable}
      hideCloseButton={hideCloseButton}
      scrollBehavior={scrollBehavior}
      autoFocus={false}
      classNames={{
        wrapper: externalClassNames?.wrapper ?? '',
        base: `bg-surface border border-border ${externalClassNames?.base ?? ''}`,
        backdrop: externalClassNames?.backdrop ?? '',
        header: `border-b border-border text-text font-heading ${externalClassNames?.header ?? ''}`,
        body: `text-text ${externalClassNames?.body ?? ''}`,
        footer: `border-t border-border ${externalClassNames?.footer ?? ''}`,
        closeButton: externalClassNames?.closeButton ?? '',
      }}
    >
      <ModalContent>
        {() => (
          <>
            {headerContent && <ModalHeader>{headerContent}</ModalHeader>}
            <ModalBody>{children}</ModalBody>
            {footerContent && <ModalFooter>{footerContent}</ModalFooter>}
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
