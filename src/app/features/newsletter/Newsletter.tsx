import { Spinner, Tab, Tabs } from '@heroui/react'
import {
  MailIcon,
  MegaphoneIcon,
  UsersIcon,
  UserCheckIcon,
  UserXIcon,
} from 'lucide-react'
import { useNewsletterHook } from './hooks/useNewsletterHook'
import { SubscribersTable } from './components/SubscribersTable'
import { CampaignsList } from './components/CampaignsList'
import { CampaignEditor } from './components/CampaignEditor'
import { DeleteSubscriberModal } from './components/modals/DeleteSubscriberModal'
import { SendCampaignModal } from './components/modals/SendCampaignModal'
import { CustomModalNextUI } from '@/app/components/UI/customModalNextUI/CustomModalNextUI'
import { newsletterService } from './services/newsletterService'

export function Newsletter() {
  const {
    activeTab,
    setActiveTab,
    campaignView,

    subscribers,
    isLoadingSubscribers,
    stats,
    isLoadingStats,
    campaigns,
    isLoadingCampaigns,

    editingCampaign,

    deleteSubscriberTarget,
    isDeleteSubscriberOpen,
    onDeleteSubscriberOpenChange,
    isDeletingSubscriber,
    handleDeleteSubscriberClick,
    handleConfirmDeleteSubscriber,

    handleCreateCampaign,
    handleEditCampaign,
    handleBackToList,
    handleDeleteCampaignClick,

    sendCampaignTarget,
    isSendCampaignOpen,
    onSendCampaignOpenChange,
    isSendingCampaign,
    handleSendCampaignClick,
    handleConfirmSendCampaign,

    previewCampaignId,
    isPreviewOpen,
    onPreviewOpenChange,
    handlePreviewCampaign,
  } = useNewsletterHook()

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-semibold uppercase tracking-wide text-accent">
          Newsletter
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Gestiona suscriptores y campañas de email marketing.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {isLoadingStats ? (
          <div className="col-span-3 flex justify-center py-4">
            <Spinner size="sm" color="warning" />
          </div>
        ) : (
          <>
            <StatsCard
              icon={<UsersIcon size={20} />}
              label="Total suscriptores"
              value={stats?.total ?? 0}
            />
            <StatsCard
              icon={<UserCheckIcon size={20} />}
              label="Activos"
              value={stats?.active ?? 0}
              accent
            />
            <StatsCard
              icon={<UserXIcon size={20} />}
              label="Inactivos"
              value={stats?.inactive ?? 0}
            />
          </>
        )}
      </div>

      {/* Tabs */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) =>
          setActiveTab(key as 'subscribers' | 'campaigns')
        }
        color="warning"
        variant="underlined"
        classNames={{
          tabList: 'border-b border-border',
          tab: 'text-text-muted data-[selected=true]:text-accent',
          cursor: 'bg-accent',
        }}
      >
        <Tab
          key="subscribers"
          title={
            <div className="flex items-center gap-2">
              <MailIcon size={16} />
              <span>Suscriptores</span>
            </div>
          }
        >
          <div className="pt-4">
            <SubscribersTable
              subscribers={subscribers}
              isLoading={isLoadingSubscribers}
              onDelete={handleDeleteSubscriberClick}
            />
          </div>
        </Tab>

        <Tab
          key="campaigns"
          title={
            <div className="flex items-center gap-2">
              <MegaphoneIcon size={16} />
              <span>Campañas</span>
            </div>
          }
        >
          <div className="pt-4">
            {campaignView === 'list' ? (
              <CampaignsList
                campaigns={campaigns}
                isLoading={isLoadingCampaigns}
                onCreate={handleCreateCampaign}
                onEdit={handleEditCampaign}
                onDelete={handleDeleteCampaignClick}
                onSend={handleSendCampaignClick}
                onPreview={handlePreviewCampaign}
              />
            ) : (
              <CampaignEditor
                campaign={editingCampaign}
                onBack={handleBackToList}
                onSend={handleSendCampaignClick}
                onPreview={handlePreviewCampaign}
              />
            )}
          </div>
        </Tab>
      </Tabs>

      {/* Modals */}
      <DeleteSubscriberModal
        isOpen={isDeleteSubscriberOpen}
        onOpenChange={onDeleteSubscriberOpenChange}
        subscriber={deleteSubscriberTarget}
        isDeleting={isDeletingSubscriber}
        onConfirm={handleConfirmDeleteSubscriber}
      />

      <SendCampaignModal
        isOpen={isSendCampaignOpen}
        onOpenChange={onSendCampaignOpenChange}
        campaign={sendCampaignTarget}
        activeSubscribers={stats?.active ?? 0}
        isSending={isSendingCampaign}
        onConfirm={handleConfirmSendCampaign}
      />

      {/* Preview Modal */}
      <CustomModalNextUI
        isOpen={isPreviewOpen}
        onOpenChange={onPreviewOpenChange}
        size="4xl"
        headerContent="Vista previa del email"
        scrollBehavior="inside"
      >
        {previewCampaignId && (
          <iframe
            src={newsletterService.getPreviewUrl(previewCampaignId)}
            title="Vista previa campaña"
            className="h-[70vh] w-full rounded-lg border border-border bg-white"
          />
        )}
      </CustomModalNextUI>
    </div>
  )
}

// ─── Stats Card ──────────────────────────────────────

function StatsCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <div
        className={`rounded-lg p-2 ${accent ? 'bg-accent/10 text-accent' : 'bg-surface-raised text-text-muted'}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-text-muted">
          {label}
        </p>
        <p
          className={`font-heading text-2xl font-bold ${accent ? 'text-accent' : 'text-text'}`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
